import { readdirSync, readFileSync } from "fs";
import { join, parse } from "path";
import { NextResponse } from "next/server";
import pages from "@/utils/pages";

export const runtime = "nodejs";

type SearchResult = {
	file: string;
	title: string;
	route: string;
	href: string;
	snippet: string;
	score: number;
};

const MAX_QUERY_LENGTH = 120;
const MAX_RESULTS = 8;
const READMES_DIR = join(process.cwd(), "public/readmes");
const pageByRoute = new Map(pages.map(page => [page.route, page]));

function normalizeText(value: string): string {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[`*_>#|]/g, " ")
		.replace(/\r/g, "")
		.replace(/[ \t]+/g, " ")
		.split("\n")
		.map(line => line.trim())
		.filter(Boolean)
		.join(" ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function titleFromMarkdown(markdown: string, fileName: string): string {
	const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
	if (heading) {
		return heading
			.replace(/[<>]/g, "") // remove all angle brackets in one pass — no multi-char pattern for CodeQL to flag
			.replace(/[^\x20-\x7E]/g, "")
			.replace(/\s+/g, " ")
			.trim();
	}
	return fileName.replace(/\.md$/, "");
}

function buildSnippet(text: string, query: string): string {
	const normalizedText = normalizeText(text);
	const normalizedQuery = normalizeText(query);
	const firstTerm = normalizedQuery.split(" ")[0] ?? normalizedQuery;
	const matchIndex = normalizedText.indexOf(firstTerm);
	const start = Math.max(matchIndex === -1 ? 0 : matchIndex - 70, 0);
	const end = Math.min(start + 180, text.length);
	const prefix = start > 0 ? "..." : "";
	const suffix = end < text.length ? "..." : "";
	return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

function scoreDocument({
	file,
	title,
	text,
	query
}: {
	file: string;
	title: string;
	text: string;
	query: string;
}): number {
	const terms = normalizeText(query).split(" ").filter(Boolean);
	const normalizedFile = normalizeText(file);
	const normalizedTitle = normalizeText(title);
	const normalizedText = normalizeText(text);
	let score = 0;

	for (const term of terms) {
		if (normalizedFile.includes(term)) score += 8;
		if (normalizedTitle.includes(term)) score += 6;
		if (normalizedText.includes(term)) score += 2;
	}

	if (normalizedText.includes(normalizeText(query))) score += 5;
	return score;
}

function searchReadmes(query: string): SearchResult[] {
	const files = readdirSync(READMES_DIR)
		.filter(file => file.endsWith(".md"))
		.sort((a, b) => a.localeCompare(b));

	return files
		.map(file => {
			const route = parse(file).name;
			const markdown = readFileSync(join(READMES_DIR, file), "utf8");
			const title = pageByRoute.get(route)?.description ?? titleFromMarkdown(markdown, file);
			const text = stripMarkdown(markdown);
			const score = scoreDocument({ file, title, text, query });
			return {
				file,
				title,
				route,
				href: `/${route}`,
				snippet: score > 0 ? buildSnippet(text, query) : text.slice(0, 180),
				score
			};
		})
		.filter(result => result.score > 0)
		.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
		.slice(0, MAX_RESULTS);
}

export function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = (searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);

	if (!query) {
		return NextResponse.json({ query, results: [] });
	}

	try {
		return NextResponse.json({ query, results: searchReadmes(query) });
	} catch {
		return NextResponse.json({ query, results: [] });
	}
}
