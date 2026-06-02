import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// SERVER-ONLY. Reads the markdown knowledge sources the portfolio agent answers from and turns
// them into small, individually-addressable chunks. This is the retrieval index that lets the
// agent search before it answers, instead of stuffing one giant context into every request.
// Never import this into client code - it uses `fs`.

export type PortfolioChunkKind = "github-repo" | "linkedin" | "featured" | "writing" | "readme" | "context";

export type PortfolioChunk = {
	/** Stable, human-recognizable id, e.g. "github:pratyush1712-cleverhug". */
	id: string;
	/** Display label for the source, e.g. "GitHub" or "Portfolio: projects". */
	source: string;
	/** Cleaned heading that titles the chunk. */
	title: string;
	kind: PortfolioChunkKind;
	/** Cleaned plain-text body used both for display and for keyword indexing. */
	text: string;
	/** Names this chunk can be referred to by (repo names, project names, headings). */
	aliases: string[];
};

// Internal richer chunk: `entityAliases` are the strong identity names (repo/project/title) that
// are safe to feed the relevance guard's allow-list. Weak aliases (inner headings, bold labels)
// stay out of the guard so they only ever influence retrieval, never what is allowed through.
type ParsedChunk = PortfolioChunk & {
	entityAliases: string[];
};

const README_DIR = "public/readmes";
const AGENT_CONTEXT_DIR = "public/agent-context";

// Raw source dumps that are deliberately NOT part of the curated knowledge base. `linkedin.md` is
// the curated, agent-facing version of `LinkedInWhole.md`; including the raw dump would add a large
// amount of duplicate, lower-signal text.
const SKIP_AGENT_CONTEXT_FILES = new Set(["LinkedInWhole.md"]);

// Explicit fallbacks so the index still loads if a directory read is unavailable in some runtime.
// `outputFileTracingIncludes` (next.config) globs both dirs into this route, so the dir reads work
// in production; the lists below are a belt-and-suspenders default.
const AGENT_CONTEXT_FALLBACK = ["github.md", "linkedin.md", "featured.md", "writing.md"];
const README_FALLBACK = [
	"overview.md",
	"education.md",
	"experience.md",
	"affiliations.md",
	"projects.md",
	"skills.md",
	"contact.md"
];

const AGENT_CONTEXT_META: Record<string, { source: string; kind: PortfolioChunkKind }> = {
	"github.md": { source: "GitHub", kind: "github-repo" },
	"linkedin.md": { source: "LinkedIn", kind: "linkedin" },
	"featured.md": { source: "Featured", kind: "featured" },
	"writing.md": { source: "Writing", kind: "writing" }
};
const DEFAULT_AGENT_CONTEXT_META = { source: "Portfolio context", kind: "context" as PortfolioChunkKind };

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
// Emoji, dingbats, arrows, and variation selectors that decorate headings (e.g. "➤", "🧪").
const DECORATION_RE =
	/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

// Generic section words that must never become an alias. As an alias they would let unrelated
// questions ("give me an overview of X") slip past the relevance guard, so they are dropped.
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
	// Generic technical section headings that would otherwise become noisy aliases.
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
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> visible text
		.replace(/<[^>]+>/g, " ") // html tags
		.replace(/[`*~]/g, "") // bold/italic/code markers
		.replace(/_/g, " ") // underscores separate words in slugs (find_my_party_backend)
		.replace(DECORATION_RE, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function cleanBody(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, " ") // fenced code blocks
		.replace(/`[^`]*`/g, " ") // inline code
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> visible text
		.replace(/<[^>]+>/g, " ") // html tags (also strips img badges like logoColor=black)
		.replace(/^\s{0,3}#{1,6}\s+/gm, " ") // heading markers
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

/** A meaningful alias has at least one non-generic, non-stopword token and is long enough. */
function isMeaningfulAlias(normalized: string): boolean {
	if (normalized.length < 3) return false;
	const tokens = normalized.split(" ").filter(Boolean);
	if (tokens.length === 0) return false;
	return tokens.some(token => !GENERIC_ALIAS_TOKENS.has(token) && !ALIAS_STOPWORDS.has(token));
}

type RawSection = {
	title: string;
	lines: string[];
	innerHeadings: string[];
	isPreamble: boolean;
};

/**
 * Split markdown into sections at "boundary" headings. Headings inside fenced code blocks are
 * ignored, and non-boundary headings (e.g. the heading levels inside an embedded README excerpt)
 * are recorded as inner headings rather than starting a new section.
 */
function splitSections(raw: string, isBoundary: (level: number, text: string) => boolean): RawSection[] {
	const lines = raw.split(/\r?\n/);
	const sections: RawSection[] = [];
	let current: RawSection = { title: "", lines: [], innerHeadings: [], isPreamble: true };
	let inFence = false;

	for (const line of lines) {
		const headingMatch = line.match(HEADING_RE);

		// A boundary heading always starts a new section, even if a code fence was left open by a
		// truncated README excerpt. Without this, an unclosed ``` would swallow every later repo.
		if (headingMatch && isBoundary(headingMatch[1].length, headingMatch[2].trim())) {
			if (current.lines.length > 0 || current.title || current.innerHeadings.length > 0) {
				sections.push(current);
			}
			inFence = false;
			current = { title: headingMatch[2].trim(), lines: [], innerHeadings: [], isPreamble: false };
			continue;
		}

		if (FENCE_RE.test(line)) {
			inFence = !inFence;
			current.lines.push(line);
			continue;
		}

		// Inner headings feed (weak) aliases, but only real markdown headings - not lines like
		// "# install deps" inside a fenced shell block.
		if (!inFence && headingMatch) current.innerHeadings.push(headingMatch[2].trim());

		current.lines.push(line);
	}

	if (current.lines.length > 0 || current.title || current.innerHeadings.length > 0) {
		sections.push(current);
	}

	return sections;
}

function pushAlias(into: string[], seen: Set<string>, candidate: string): void {
	const cleaned = cleanHeading(candidate);
	if (!cleaned) return;
	const normalized = normalizeForMatch(cleaned);
	if (!normalized || seen.has(normalized) || !isMeaningfulAlias(normalized)) return;
	seen.add(normalized);
	into.push(cleaned);
}

function collectStrongAliases(section: RawSection): { aliases: string[]; seen: Set<string> } {
	const aliases: string[] = [];
	const seen = new Set<string>();
	const title = section.title.trim();

	// Repo headings ("owner/repo") yield the repo name, owner, and the full slug.
	if (REPO_RE.test(title)) {
		const [owner, repo] = title.split("/");
		pushAlias(aliases, seen, repo);
		pushAlias(aliases, seen, owner);
		pushAlias(aliases, seen, title.replace("/", " "));
	} else {
		pushAlias(aliases, seen, title);
	}

	for (const line of section.lines) {
		const labelMatch = line.match(METADATA_LABEL_RE);
		if (labelMatch) {
			const label = labelMatch[1].toLowerCase();
			const value = labelMatch[2].trim();
			if (label === "alias" || label === "aliases") {
				for (const part of value.split(/[,/|]/)) pushAlias(aliases, seen, part);
			} else {
				pushAlias(aliases, seen, value);
			}
		}
	}

	return { aliases, seen };
}

function collectWeakAliases(section: RawSection, seen: Set<string>): string[] {
	const aliases: string[] = [];

	for (const heading of section.innerHeadings) {
		pushAlias(aliases, seen, heading);
	}

	for (const line of section.lines) {
		let match: RegExpExecArray | null;
		BOLD_LABEL_RE.lastIndex = 0;
		while ((match = BOLD_LABEL_RE.exec(line)) !== null) {
			pushAlias(aliases, seen, match[1]);
		}
	}

	return aliases;
}

function slugify(input: string): string {
	const slug = normalizeForMatch(input).replace(/\s+/g, "-").slice(0, 60);
	return slug || "section";
}

function buildChunk(
	section: RawSection,
	spec: { source: string; kind: PortfolioChunkKind; idPrefix: string },
	usedIds: Set<string>
): ParsedChunk | null {
	const text = capText(cleanBody(section.lines.join("\n")), MAX_CHUNK_TEXT_CHARS);

	const { aliases: strongAliases, seen } = collectStrongAliases(section);
	const weakAliases = collectWeakAliases(section, seen);

	const aliases = [...strongAliases, ...weakAliases].slice(0, MAX_RETRIEVAL_ALIASES);
	const entityAliases = strongAliases.slice(0, MAX_ENTITY_ALIASES);

	// A preamble (content before the first boundary heading, e.g. "# GitHub Context\n## Curated
	// repositories") is structural noise unless it carries real, non-heading body text.
	const hasBodyText = section.lines.some(line => line.trim() && !HEADING_RE.test(line));
	if (section.isPreamble && !hasBodyText) return null;

	const hasUsefulText = text.length >= MIN_CHUNK_TEXT_CHARS;
	if (!hasUsefulText && entityAliases.length === 0) return null;
	if (!text && aliases.length === 0) return null;

	const title = section.title ? cleanHeading(section.title) : spec.source;

	let id = `${spec.idPrefix}:${slugify(section.title || spec.source)}`;
	let suffix = 2;
	while (usedIds.has(id)) {
		id = `${spec.idPrefix}:${slugify(section.title || spec.source)}-${suffix++}`;
	}
	usedIds.add(id);

	return { id, source: spec.source, title, kind: spec.kind, text, aliases, entityAliases };
}

function parseFile(
	raw: string,
	spec: {
		source: string;
		kind: PortfolioChunkKind;
		idPrefix: string;
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

function githubBoundary(level: number, text: string): boolean {
	return level === 2 && REPO_RE.test(text.trim());
}

function headingsBoundary(levels: number[]): (level: number, text: string) => boolean {
	return level => levels.includes(level);
}

function loadAll(): ParsedChunk[] {
	const usedIds = new Set<string>();
	const chunks: ParsedChunk[] = [];

	for (const fileName of readDirMarkdown(AGENT_CONTEXT_DIR, AGENT_CONTEXT_FALLBACK)) {
		if (SKIP_AGENT_CONTEXT_FILES.has(fileName)) continue;

		const raw = readFileSafe(AGENT_CONTEXT_DIR, fileName);
		if (!raw.trim()) continue;

		const meta = AGENT_CONTEXT_META[fileName] ?? DEFAULT_AGENT_CONTEXT_META;
		const isGithub = fileName === "github.md";

		chunks.push(
			...parseFile(
				raw,
				{
					source: meta.source,
					kind: meta.kind,
					idPrefix: fileName.replace(/\.md$/, ""),
					isBoundary: isGithub ? githubBoundary : headingsBoundary([2])
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

	const chunks: PortfolioChunk[] = parsed.map(({ entityAliases: _entityAliases, ...chunk }) => chunk);

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

/** All retrieval chunks. Cached for the lifetime of the process (the source files are static). */
export function loadPortfolioChunks(): PortfolioChunk[] {
	return getCache().chunks;
}

/**
 * Strong identity names (repo names, project/section titles) discovered in the knowledge base.
 * These extend the hand-maintained allow-list so newly-ingested projects like "CleverHug" are
 * recognized by the relevance guard without code changes.
 */
export function getDynamicPortfolioEntities(): string[] {
	return getCache().entities;
}

/** True when the input mentions a dynamically-discovered portfolio entity (word-boundary safe). */
export function matchesDynamicPortfolioEntity(input: string): boolean {
	const haystack = ` ${normalizeForMatch(input)} `;
	return getCache().entityMatchers.some(alias => alias.length > 0 && haystack.includes(` ${alias} `));
}

/** Test-only hook to rebuild the cache (e.g. after changing env caps). */
export function __resetPortfolioKnowledgeCache(): void {
	cache = null;
}

export { normalizeForMatch as normalizePortfolioText };
