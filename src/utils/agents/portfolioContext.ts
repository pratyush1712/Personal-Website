import { readFileSync } from "fs";
import { join } from "path";
import pages from "@/utils/pages";
import { links } from "@/utils/links";
import { PORTFOLIO_AGENT_SOURCES, type PortfolioSource } from "./portfolioSources";

// SERVER-ONLY. Builds a bounded full-context fallback from the same explicit source allow-list as
// the retriever. Raw exports and arbitrary directory files are never included.

const MAX_CONTEXT_CHARS = 20_000;
export const PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS = positiveInt(
	process.env.PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS,
	4_000
);

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function stripMarkdown(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[`*_>#|]/g, " ")
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

function readFile(relativeDir: string, fileName: string): string {
	try {
		return readFileSync(join(process.cwd(), relativeDir, fileName), "utf8");
	} catch {
		return "";
	}
}

function readReadme(route: string): string {
	const normalizedRoute = route.replace(/^\/+/, "") || "home";
	return readFile("public/readmes", `${normalizedRoute}.md`);
}

function readSource(source: PortfolioSource): string {
	return capText(
		stripMarkdown(readFile(source.relativeDir, source.fileName)),
		PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS
	);
}

/** Reads a curated server-side context file. Kept exported for focused unit tests. */
export function readOptionalContextFile(relativePath: string): string {
	return capText(
		stripMarkdown(readFile("content/portfolio-agent", relativePath)),
		PORTFOLIO_AGENT_EXTRA_CONTEXT_FILE_CHARS
	);
}

export function buildPortfolioContext(): string {
	const sections: string[] = ["NAME\nPratyush Sudhakar"];
	const linkLines = links.map(link => `- ${link.title}: ${link.href}`).join("\n");
	if (linkLines) sections.push(`LINKS\n${linkLines}`);

	const contact = stripMarkdown(readReadme("contact"));
	if (contact) sections.push(`CONTACT\n${contact}`);

	for (const source of PORTFOLIO_AGENT_SOURCES) {
		const text = readSource(source);
		if (text) sections.push(`${source.header}\n${text}`);
	}

	for (const page of pages) {
		const text = stripMarkdown(readReadme(page.route));
		if (text) sections.push(`${page.route.toUpperCase()}\n${text}`);
	}

	const context = sections.join("\n\n");
	return context.length > MAX_CONTEXT_CHARS ? `${context.slice(0, MAX_CONTEXT_CHARS)}\n…(truncated)` : context;
}
