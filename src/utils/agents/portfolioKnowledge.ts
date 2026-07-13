import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { PORTFOLIO_AGENT_SOURCES, type PortfolioSource } from "./portfolioSources";

// SERVER-ONLY. Reads an explicit allow-list of curated evidence plus the portfolio readmes and
// turns them into small, addressable chunks. Never import this module into client code.

export type PortfolioChunkKind =
	"github-repo" | "linkedin" | "featured" | "writing" | "readme" | "context" | "profile" | "advocacy" | "public-post";

export type PortfolioChunk = {
	id: string;
	source: string;
	title: string;
	kind: PortfolioChunkKind;
	text: string;
	aliases: string[];
	priority?: number;
};

type ParsedChunk = PortfolioChunk & { entityAliases: string[] };

const README_DIR = "public/readmes";
const README_FALLBACK = [
	"overview.md",
	"education.md",
	"experience.md",
	"affiliations.md",
	"projects.md",
	"skills.md",
	"contact.md"
];

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const MAX_CHUNK_TEXT_CHARS = positiveInt(process.env.PORTFOLIO_AGENT_MAX_CHUNK_CHARS, 2_400);
const MIN_CHUNK_TEXT_CHARS = 24;
const MAX_RETRIEVAL_ALIASES = 20;
const MAX_ENTITY_ALIASES = 8;

const REPO_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9._-]+$/;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE_RE = /^\s*(```|~~~)/;
const METADATA_LABEL_RE = /^\s*(?:[-*]\s*)?(name|project|repository|repo|title|alias|aliases)\s*:\s*(.+)$/i;
const BOLD_LABEL_RE = /\*\*([^*\n]{2,40})\*\*\s*:/g;
const DECORATION_RE =
	/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

const GENERIC_ALIAS_TOKENS = new Set([
	"overview",
	"about",
	"summary",
	"introduction",
	"intro",
	"description",
	"features",
	"feature",
	"usage",
	"installation",
	"install",
	"prerequisites",
	"prerequisite",
	"architecture",
	"configuration",
	"config",
	"quickstart",
	"screenshots",
	"screenshot",
	"contributing",
	"contribute",
	"contact",
	"license",
	"readme",
	"excerpt",
	"source",
	"sources",
	"notes",
	"note",
	"links",
	"link",
	"demo",
	"demos",
	"home",
	"index",
	"deploy",
	"deployment",
	"running",
	"run",
	"setup",
	"started",
	"getting",
	"learn",
	"more",
	"highlights",
	"profile",
	"public",
	"frontend",
	"backend",
	"fullstack",
	"api",
	"apis",
	"database",
	"databases",
	"testing",
	"tests",
	"roadmap",
	"todo",
	"todos",
	"changelog",
	"authentication",
	"auth",
	"security",
	"performance",
	"modules",
	"files",
	"requirements",
	"dependencies"
]);

const ALIAS_STOPWORDS = new Set([
	"the",
	"a",
	"an",
	"of",
	"and",
	"or",
	"to",
	"for",
	"with",
	"at",
	"on",
	"in",
	"by",
	"my",
	"his",
	"her",
	"i",
	"am",
	"is",
	"are"
]);

function normalizeForMatch(input: string): string {
	return input
		.toLowerCase()
		.replace(/[’'`]/g, "")
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function cleanHeading(text: string): string {
	return text
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[`*~]/g, "")
		.replace(/_/g, " ")
		.replace(DECORATION_RE, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function cleanBody(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/^\s{0,3}#{1,6}\s+/gm, " ")
		.replace(/[`*_>#|~]/g, " ")
		.replace(/\r/g, "")
		.split("\n")
		.map(line => line.trim())
		.join("\n")
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function capText(text: string, maxChars: number): string {
	return text.length > maxChars ? `${text.slice(0, maxChars)}\n…(truncated)` : text;
}

function isMeaningfulAlias(normalized: string): boolean {
	if (normalized.length < 3) return false;
	const tokens = normalized.split(" ").filter(Boolean);
	return tokens.some(token => !GENERIC_ALIAS_TOKENS.has(token) && !ALIAS_STOPWORDS.has(token));
}

type RawSection = {
	title: string;
	lines: string[];
	innerHeadings: string[];
	isPreamble: boolean;
};

function splitSections(raw: string, isBoundary: (level: number, text: string) => boolean): RawSection[] {
	const sections: RawSection[] = [];
	let current: RawSection = {
		title: "",
		lines: [],
		innerHeadings: [],
		isPreamble: true
	};
	let inFence = false;

	for (const line of raw.split(/\r?\n/)) {
		const headingMatch = line.match(HEADING_RE);
		if (headingMatch && isBoundary(headingMatch[1].length, headingMatch[2].trim())) {
			if (current.lines.length > 0 || current.title || current.innerHeadings.length > 0) sections.push(current);
			inFence = false;
			current = {
				title: headingMatch[2].trim(),
				lines: [],
				innerHeadings: [],
				isPreamble: false
			};
			continue;
		}

		if (FENCE_RE.test(line)) {
			inFence = !inFence;
			current.lines.push(line);
			continue;
		}

		if (!inFence && headingMatch) current.innerHeadings.push(headingMatch[2].trim());
		current.lines.push(line);
	}

	if (current.lines.length > 0 || current.title || current.innerHeadings.length > 0) sections.push(current);
	return sections;
}

function pushAlias(into: string[], seen: Set<string>, candidate: string): void {
	const cleaned = cleanHeading(candidate);
	const normalized = normalizeForMatch(cleaned);
	if (!normalized || seen.has(normalized) || !isMeaningfulAlias(normalized)) return;
	seen.add(normalized);
	into.push(cleaned);
}

function collectStrongAliases(section: RawSection): {
	aliases: string[];
	seen: Set<string>;
} {
	const aliases: string[] = [];
	const seen = new Set<string>();
	const title = section.title.trim();

	if (REPO_RE.test(title)) {
		const [owner, repo] = title.split("/");
		pushAlias(aliases, seen, repo);
		pushAlias(aliases, seen, owner);
		pushAlias(aliases, seen, title.replace("/", " "));
	} else {
		pushAlias(aliases, seen, title);
	}

	for (const line of section.lines) {
		const match = line.match(METADATA_LABEL_RE);
		if (!match) continue;
		const label = match[1].toLowerCase();
		const value = match[2].trim();
		if (label === "alias" || label === "aliases") {
			for (const part of value.split(/[,/|]/)) pushAlias(aliases, seen, part);
		} else {
			pushAlias(aliases, seen, value);
		}
	}

	return { aliases, seen };
}

function collectWeakAliases(section: RawSection, seen: Set<string>): string[] {
	const aliases: string[] = [];
	for (const heading of section.innerHeadings) pushAlias(aliases, seen, heading);
	for (const line of section.lines) {
		let match: RegExpExecArray | null;
		BOLD_LABEL_RE.lastIndex = 0;
		while ((match = BOLD_LABEL_RE.exec(line)) !== null) pushAlias(aliases, seen, match[1]);
	}
	return aliases;
}

function slugify(input: string): string {
	return normalizeForMatch(input).replace(/\s+/g, "-").slice(0, 60) || "section";
}

function buildChunk(
	section: RawSection,
	spec: {
		source: string;
		kind: PortfolioChunkKind;
		idPrefix: string;
		priority?: number;
	},
	usedIds: Set<string>
): ParsedChunk | null {
	const text = capText(cleanBody(section.lines.join("\n")), MAX_CHUNK_TEXT_CHARS);
	const { aliases: strongAliases, seen } = collectStrongAliases(section);
	const aliases = [...strongAliases, ...collectWeakAliases(section, seen)].slice(0, MAX_RETRIEVAL_ALIASES);
	const entityAliases = strongAliases.slice(0, MAX_ENTITY_ALIASES);
	const hasBodyText = section.lines.some(line => line.trim() && !HEADING_RE.test(line));
	if (section.isPreamble && !hasBodyText) return null;
	if (text.length < MIN_CHUNK_TEXT_CHARS && entityAliases.length === 0) return null;
	if (!text && aliases.length === 0) return null;

	const title = section.title ? cleanHeading(section.title) : spec.source;
	let id = `${spec.idPrefix}:${slugify(section.title || spec.source)}`;
	let suffix = 2;
	while (usedIds.has(id)) id = `${spec.idPrefix}:${slugify(section.title || spec.source)}-${suffix++}`;
	usedIds.add(id);

	return {
		id,
		source: spec.source,
		title,
		kind: spec.kind,
		text,
		aliases,
		entityAliases,
		priority: spec.priority
	};
}

function parseFile(
	raw: string,
	spec: {
		source: string;
		kind: PortfolioChunkKind;
		idPrefix: string;
		priority?: number;
		isBoundary: (level: number, text: string) => boolean;
	},
	usedIds: Set<string>
): ParsedChunk[] {
	return splitSections(raw, spec.isBoundary)
		.map(section => buildChunk(section, spec, usedIds))
		.filter((chunk): chunk is ParsedChunk => chunk !== null);
}

function readDirMarkdown(relativeDir: string, fallback: string[]): string[] {
	try {
		const files = readdirSync(join(process.cwd(), relativeDir)).filter(file => file.endsWith(".md"));
		return files.length > 0 ? files : fallback;
	} catch {
		return fallback;
	}
}

function readFileSafe(relativeDir: string, fileName: string): string {
	try {
		return readFileSync(join(process.cwd(), relativeDir, fileName), "utf8");
	} catch {
		return "";
	}
}

function readRequiredPortfolioSource(source: PortfolioSource, root = process.cwd()): string {
	const relativePath = join(source.relativeDir, source.fileName);
	let raw: string;
	try {
		raw = readFileSync(join(root, relativePath), "utf8");
	} catch {
		throw new Error(`Missing required portfolio agent source: ${relativePath}`);
	}
	if (!raw.trim()) throw new Error(`Required portfolio agent source is empty: ${relativePath}`);
	return raw;
}

export function assertPortfolioSourcesPresent(root = process.cwd()): void {
	for (const source of PORTFOLIO_AGENT_SOURCES) readRequiredPortfolioSource(source, root);
}

function githubBoundary(level: number, text: string): boolean {
	return level === 2 && REPO_RE.test(text.trim());
}

function headingsBoundary(levels: number[]): (level: number) => boolean {
	return level => levels.includes(level);
}

function loadAll(): ParsedChunk[] {
	const usedIds = new Set<string>();
	const chunks: ParsedChunk[] = [];

	for (const source of PORTFOLIO_AGENT_SOURCES) {
		const raw = readRequiredPortfolioSource(source);
		chunks.push(
			...parseFile(
				raw,
				{
					source: source.source,
					kind: source.kind,
					idPrefix: source.fileName.replace(/\.md$/, ""),
					priority: source.priority,
					isBoundary: source.boundary === "github-repositories" ? githubBoundary : headingsBoundary([2])
				},
				usedIds
			)
		);
	}

	for (const fileName of readDirMarkdown(README_DIR, README_FALLBACK)) {
		const raw = readFileSafe(README_DIR, fileName);
		if (!raw.trim()) continue;
		const route = fileName.replace(/\.md$/, "");
		chunks.push(
			...parseFile(
				raw,
				{
					source: `Portfolio: ${route}`,
					kind: "readme",
					idPrefix: `readme-${route}`,
					priority: 70,
					isBoundary: headingsBoundary([2, 3])
				},
				usedIds
			)
		);
	}

	return chunks;
}

type KnowledgeCache = {
	chunks: PortfolioChunk[];
	entities: string[];
	entityMatchers: string[];
};
let cache: KnowledgeCache | null = null;

function buildCache(): KnowledgeCache {
	const parsed = loadAll();
	const chunks = parsed.map(({ entityAliases: _entityAliases, ...chunk }) => chunk);
	const entitySeen = new Set<string>();
	const entities: string[] = [];
	const entityMatchers: string[] = [];

	for (const chunk of parsed) {
		for (const alias of chunk.entityAliases) {
			const normalized = normalizeForMatch(alias);
			if (!normalized || entitySeen.has(normalized)) continue;
			entitySeen.add(normalized);
			entities.push(alias);
			entityMatchers.push(normalized);
		}
	}

	return { chunks, entities, entityMatchers };
}

function getCache(): KnowledgeCache {
	if (!cache) cache = buildCache();
	return cache;
}

export function loadPortfolioChunks(): PortfolioChunk[] {
	return getCache().chunks;
}

export function getDynamicPortfolioEntities(): string[] {
	return getCache().entities;
}

export function matchesDynamicPortfolioEntity(input: string): boolean {
	const haystack = ` ${normalizeForMatch(input)} `;
	return getCache().entityMatchers.some(alias => alias.length > 0 && haystack.includes(` ${alias} `));
}

export function __resetPortfolioKnowledgeCache(): void {
	cache = null;
}

export { normalizeForMatch as normalizePortfolioText };
