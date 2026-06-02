import { readFileSync } from "fs";
import { join } from "path";
import pages from "@/utils/pages";
import { links } from "@/utils/links";

// SERVER-ONLY. Reads the same markdown the site renders and distills it into compact plain text
// for the agent's system prompt. Never import this into client code - it uses `fs`.

const MAX_CONTEXT_CHARS = 20000;
export const PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS = positiveInt(
	process.env.PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS,
	4_000
);

const EXTRA_CONTEXT_FILES = [
	{ path: "github.md", header: "GITHUB CONTEXT" },
	{ path: "linkedin.md", header: "LINKEDIN CONTEXT" },
	{ path: "featured.md", header: "FEATURED POSTS AND PUBLIC CONTENT" },
	{ path: "writing.md", header: "WRITING AND ARTICLES" }
] as const;

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function stripMarkdown(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, " ") // fenced code blocks
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> their visible text
		.replace(/<[^>]+>/g, " ") // raw HTML tags
		.replace(/[`*_>#|]/g, " ") // markdown punctuation
		.replace(/\r/g, "")
		.replace(/[ \t]+/g, " ")
		.split("\n")
		.map(line => line.trim())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function capText(text: string, maxChars: number): string {
	return text.length > maxChars ? `${text.slice(0, maxChars)}\n…(truncated)` : text;
}

function readReadme(route: string): string {
	try {
		const normalizedRoute = route.replace(/^\/+/, "") || "home";
		return readFileSync(join(process.cwd(), "public/readmes", `${normalizedRoute}.md`), "utf8");
	} catch {
		return "";
	}
}

export function readOptionalContextFile(relativePath: string): string {
	try {
		const raw = readFileSync(join(process.cwd(), "public/agent-context", relativePath), "utf8");
		return capText(stripMarkdown(raw), PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS);
	} catch {
		return "";
	}
}

// Reuses the site's own data sources (pages.ts + public/readmes + links.ts) so the agent's
// knowledge never drifts from what the site actually shows. Links and contact go first so they
// survive truncation; the longer prose sections follow.
export function buildPortfolioContext(): string {
	const sections: string[] = ["NAME\nPratyush Sudhakar"];

	const linkLines = links.map(link => `- ${link.title}: ${link.href}`).join("\n");
	if (linkLines) sections.push(`LINKS\n${linkLines}`);

	const contact = stripMarkdown(readReadme("contact"));
	if (contact) sections.push(`CONTACT\n${contact}`);

	for (const file of EXTRA_CONTEXT_FILES) {
		const text = readOptionalContextFile(file.path);
		if (text) sections.push(`${file.header}\n${text}`);
	}

	for (const page of pages) {
		const text = stripMarkdown(readReadme(page.route));
		if (text) sections.push(`${page.route.toUpperCase()}\n${text}`);
	}

	const context = sections.join("\n\n");
	return context.length > MAX_CONTEXT_CHARS ? `${context.slice(0, MAX_CONTEXT_CHARS)}\n…(truncated)` : context;
}
