import { readFileSync } from "fs";
import { join } from "path";
import pages from "@/utils/pages";
import { links } from "@/utils/links";

// SERVER-ONLY. Reads the same markdown the site renders and distills it into compact plain text
// for the agent's system prompt. Never import this into client code - it uses `fs`.

const MAX_CONTEXT_CHARS = 20000;

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

function readReadme(route: string): string {
	try {
		return readFileSync(join(process.cwd(), "public/readmes", `${route}.md`), "utf8");
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

	for (const page of pages) {
		const text = stripMarkdown(readReadme(page.route));
		if (text) sections.push(`${page.route.toUpperCase()}\n${text}`);
	}

	const context = sections.join("\n\n");
	return context.length > MAX_CONTEXT_CHARS ? `${context.slice(0, MAX_CONTEXT_CHARS)}\n…(truncated)` : context;
}
