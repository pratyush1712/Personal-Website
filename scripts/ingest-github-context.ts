import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

const GITHUB_API_BASE = "https://api.github.com";
const OUTPUT_FILE = join(process.cwd(), "public/agent-context/github.md");
const README_EXCERPT_CHARS = 2_000;

const CURATED_REPOS = [
	// Portfolio / personal brand
	"pratyush1712/Personal-Website",
	"pratyush1712/pratyush1712",
	"pratyush1712/Personal-Agent-Homebase",
	"pratyush1712/braindump",
	// Current high-signal personal systems / AI-adjacent work
	"pratyush1712/Habits-OS",
	"pratyush1712/legacy-support-adjudication-skill",
	"pratyush1712/house-chores-tracker",

	// Neuroinclusive / accessibility / mental health aligned projects
	"pratyush1712/ADHD-Friendly-Text-Enhancer",
	"pratyush1712/cornell-mind-matters",
	"pratyush1712/bipolar-disorder",
	"pratyush1712/CleverHug",
	"pratyush1712/Actigraphy-Based-Mood-Disorder-Analysis",

	// Cornell / research / audit tooling
	"Audit-Tools-DECA-Lab-Cornell/audit-tools-backend",
	"Audit-Tools-DECA-Lab-Cornell/audit-tools-playspace-frontend",
	"Audit-Tools-DECA-Lab-Cornell/audit-tools-playspace-mobile",
	"pratyush1712/Rizvi-Lab",

	// Data / backend / systems projects
	"pratyush1712/phylogentic-tree",
	"pratyush1712/AIGeoLocator",
	"pratyush1712/data-engineering",
	"pratyush1712/Timebite-Backend",
	"pratyush1712/find_my_party_backend",

	// Product / app projects
	"pratyush1712/Personal-Content-Sharing-Platform",
	"pratyush1712/Wi-Find",
	"pratyush1712/Wi-Find-Server",
	"pratyush1712/Harmonious-Sounds",

	// Community / educational context
	"pratyush1712/CornellCSWiki",

	// Perfect Match
	"Perfect-Match-Org/perfect-match-web"
] as const;

type GitHubRepo = {
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	topics?: string[];
	stargazers_count: number;
	forks_count: number;
	pushed_at: string;
};

type GitHubReadme = {
	content: string;
	encoding: string;
};

function authHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28"
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	return headers;
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every(item => typeof item === "string");
}

function parseRepo(value: unknown): GitHubRepo {
	if (!value || typeof value !== "object") throw new Error("GitHub repo response was not an object.");

	const repo = value as Record<string, unknown>;
	const fullName = repo.full_name;
	const htmlUrl = repo.html_url;
	const pushedAt = repo.pushed_at;
	const stars = repo.stargazers_count;
	const forks = repo.forks_count;

	if (typeof fullName !== "string") throw new Error("GitHub repo response omitted full_name.");
	if (typeof htmlUrl !== "string") throw new Error(`GitHub repo ${fullName} omitted html_url.`);
	if (typeof pushedAt !== "string") throw new Error(`GitHub repo ${fullName} omitted pushed_at.`);
	if (typeof stars !== "number") throw new Error(`GitHub repo ${fullName} omitted stargazers_count.`);
	if (typeof forks !== "number") throw new Error(`GitHub repo ${fullName} omitted forks_count.`);

	return {
		full_name: fullName,
		description: typeof repo.description === "string" ? repo.description : null,
		html_url: htmlUrl,
		homepage: typeof repo.homepage === "string" && repo.homepage.trim() ? repo.homepage : null,
		language: typeof repo.language === "string" ? repo.language : null,
		topics: isStringArray(repo.topics) ? repo.topics : [],
		stargazers_count: stars,
		forks_count: forks,
		pushed_at: pushedAt
	};
}

function parseReadme(value: unknown): GitHubReadme | null {
	if (!value || typeof value !== "object") return null;

	const readme = value as Record<string, unknown>;
	return typeof readme.content === "string" && typeof readme.encoding === "string"
		? { content: readme.content, encoding: readme.encoding }
		: null;
}

async function fetchJson(url: string): Promise<unknown> {
	const response = await fetch(url, { headers: authHeaders() });

	if (!response.ok) {
		throw new Error(`GitHub API request failed (${response.status}) for ${url}`);
	}

	return response.json() as Promise<unknown>;
}

async function fetchRepo(repo: string): Promise<GitHubRepo> {
	return parseRepo(await fetchJson(`${GITHUB_API_BASE}/repos/${repo}`));
}

async function fetchReadmeExcerpt(repo: string): Promise<string> {
	const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}/readme`, { headers: authHeaders() });

	if (response.status === 404) return "";
	if (!response.ok) throw new Error(`GitHub README request failed (${response.status}) for ${repo}`);

	const readme = parseReadme(await response.json());
	if (!readme || readme.encoding !== "base64") return "";

	const decoded = Buffer.from(readme.content.replace(/\n/g, ""), "base64").toString("utf8").trim();
	return decoded.length > README_EXCERPT_CHARS
		? `${decoded.slice(0, README_EXCERPT_CHARS)}\n...(README excerpt truncated)`
		: decoded;
}

function renderRepo(repo: GitHubRepo, readmeExcerpt: string): string {
	const lines = [
		`## ${repo.full_name}`,
		"",
		`- Description: ${repo.description ?? "No public description provided."}`,
		`- URL: ${repo.html_url}`
	];

	if (repo.homepage) lines.push(`- Homepage/demo: ${repo.homepage}`);
	if (repo.language) lines.push(`- Primary language: ${repo.language}`);
	if (repo.topics && repo.topics.length > 0) lines.push(`- Topics: ${repo.topics.join(", ")}`);
	if (repo.stargazers_count > 0) lines.push(`- Stars: ${repo.stargazers_count}`);
	if (repo.forks_count > 0) lines.push(`- Forks: ${repo.forks_count}`);

	lines.push(`- Last pushed: ${repo.pushed_at}`);

	if (readmeExcerpt) {
		lines.push("", "### README excerpt", "", readmeExcerpt);
	}

	return lines.join("\n");
}

async function buildContextMarkdown(): Promise<string> {
	const sections: string[] = [];

	for (const repoName of CURATED_REPOS) {
		const repo = await fetchRepo(repoName);
		const readmeExcerpt = await fetchReadmeExcerpt(repoName);
		sections.push(renderRepo(repo, readmeExcerpt));
	}

	return (
		[
			"# GitHub Context",
			"",
			"<!-- Generated by `pnpm ingest:github` from a curated allow-list of public repositories. Public professional information only. Do not paste secrets, private repository data, environment variables, or private commits here. -->",
			"",
			"## Curated repositories",
			"",
			sections.join("\n\n")
		]
			.join("\n")
			.trimEnd() + "\n"
	);
}

async function main() {
	try {
		const markdown = await buildContextMarkdown();
		await mkdir(dirname(OUTPUT_FILE), { recursive: true });
		await writeFile(OUTPUT_FILE, markdown, "utf8");
		console.log(`Updated ${OUTPUT_FILE} from ${CURATED_REPOS.length} curated GitHub repo(s).`);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown GitHub ingestion error.";
		console.error(`GitHub context ingestion failed; existing context file was not modified. ${message}`);
		process.exitCode = 1;
	}
}

void main();
