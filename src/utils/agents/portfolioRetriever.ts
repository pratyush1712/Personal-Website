import { loadPortfolioChunks, PortfolioChunk, PortfolioChunkKind } from "./portfolioKnowledge";

// SERVER-ONLY (depends on portfolioKnowledge, which reads the filesystem).
//
// Deterministic, dependency-free hybrid retrieval over the portfolio knowledge base. Given a query
// it ranks chunks with a layered lexical score:
//   1. exact normalized alias match  -> strongest (repo / project names)
//   2. title token overlap           -> high
//   3. idf-weighted keyword overlap  -> medium
//   4. source-type boost             -> small, only when the query names a source (github/writing/…)
// No network and no LLM call: same input always yields the same ranking, which keeps it cheap and
// unit-testable. It is intentionally structured so the scoring core can later be swapped for an
// embedding / vector-store retriever without changing the route or the return shape.

export type RetrievedPortfolioChunk = {
	id: string;
	source: string;
	title: string;
	kind: PortfolioChunkKind;
	text: string;
	score: number;
	matchedAliases: string[];
};

export type PortfolioRetrievalDebug = {
	query: string;
	candidateCount: number;
	signaledKinds: PortfolioChunkKind[];
	usedSourceFallback: boolean;
	selected: Array<{
		id: string;
		source: string;
		score: number;
		matchedAliases: string[];
	}>;
};

export type PortfolioRetrievalResult = {
	query: string;
	chunks: RetrievedPortfolioChunk[];
	totalChars: number;
	usedSourceFallback: boolean;
	debug: PortfolioRetrievalDebug;
};

export type RetrievalOptions = {
	maxChars?: number;
	maxChunks?: number;
	minScore?: number;
	/** Inject a chunk set (tests). Defaults to the loaded knowledge base. */
	chunks?: PortfolioChunk[];
};

type MessageLike = { role: string; content: string };

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_MAX_CHARS = positiveInt(process.env.PORTFOLIO_AGENT_RETRIEVAL_MAX_CHARS, 8_000);
const DEFAULT_MAX_CHUNKS = positiveInt(process.env.PORTFOLIO_AGENT_RETRIEVAL_MAX_CHUNKS, 6);
const DEFAULT_MIN_SCORE = 9;

// Scoring weights. Tuned so a single rare keyword or any alias hit clears MIN_SCORE, while
// incidental matches on common words do not.
const W_ALIAS = 40;
const W_ALIAS_WORD = 6; // bonus per extra word: longer aliases are more specific
const W_ALIAS_WORD_CAP = 4;
const W_TITLE = 9;
const W_KEYWORD = 3;
const W_SOURCE = 7;
const STRONG_IDF = 2.0;
const SOURCE_FALLBACK_SCORE = 1;

const STOPWORDS = new Set([
	"the",
	"a",
	"an",
	"and",
	"or",
	"but",
	"of",
	"to",
	"in",
	"on",
	"for",
	"with",
	"at",
	"by",
	"from",
	"as",
	"is",
	"are",
	"was",
	"were",
	"be",
	"been",
	"being",
	"am",
	"do",
	"does",
	"did",
	"doing",
	"have",
	"has",
	"had",
	"this",
	"that",
	"these",
	"those",
	"it",
	"its",
	"he",
	"she",
	"they",
	"them",
	"his",
	"her",
	"their",
	"your",
	"my",
	"our",
	"me",
	"you",
	"we",
	"i",
	"us",
	"what",
	"whats",
	"who",
	"whom",
	"whose",
	"why",
	"how",
	"when",
	"where",
	"which",
	"can",
	"could",
	"would",
	"should",
	"will",
	"shall",
	"may",
	"might",
	"must",
	"about",
	"into",
	"over",
	"under",
	"than",
	"then",
	"there",
	"here",
	"please",
	"tell",
	"give",
	"show",
	"explain",
	"describe",
	"list",
	"summarize",
	"summarise",
	"get",
	"got",
	"find",
	"want",
	"need",
	"know",
	"let",
	"make",
	"more",
	"most",
	"some",
	"any",
	"all",
	"just",
	"also",
	"like",
	"using",
	"use",
	"used",
	"does",
	"done",
	// handled separately as source signals, noisy as keywords
	"project",
	"projects",
	"github",
	"linkedin"
]);

function normalize(input: string): string {
	return input
		.toLowerCase()
		.replace(/[’'`]/g, "")
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/** Remove URLs/domains so tokens like "https", "com", or a domain's TLD do not pollute the index. */
function stripUrls(input: string): string {
	return input
		.replace(/https?:\/\/\S+/gi, " ")
		.replace(/\b[\w-]+\.(?:com|org|net|io|dev|app|ai|co|life|edu|gov|me|xyz)\b/gi, " ");
}

function tokenize(input: string): string[] {
	return normalize(input)
		.split(" ")
		.filter(token => token.length >= 2 && !STOPWORDS.has(token));
}

type IndexedChunk = {
	chunk: PortfolioChunk;
	normalizedAliases: string[];
	titleTokens: Set<string>;
	textTokens: Set<string>;
};

type PortfolioIndex = {
	chunks: IndexedChunk[];
	idf: Map<string, number>;
};

function buildIndex(chunks: PortfolioChunk[]): PortfolioIndex {
	const indexed: IndexedChunk[] = chunks.map(chunk => {
		const titleTokens = new Set(tokenize(chunk.title));
		const aliasTokenText = chunk.aliases.join(" ");
		const textTokens = new Set([
			...tokenize(chunk.title),
			...tokenize(aliasTokenText),
			...tokenize(stripUrls(chunk.text))
		]);
		const normalizedAliases = Array.from(new Set(chunk.aliases.map(normalize).filter(alias => alias.length >= 3)));
		return { chunk, titleTokens, textTokens, normalizedAliases };
	});

	const df = new Map<string, number>();
	for (const item of indexed) {
		for (const token of item.textTokens) {
			df.set(token, (df.get(token) ?? 0) + 1);
		}
	}

	const total = indexed.length || 1;
	const idf = new Map<string, number>();
	for (const [token, count] of df) {
		idf.set(token, Math.log(1 + total / count));
	}

	return { chunks: indexed, idf };
}

// Cache the index for the default (filesystem-loaded) chunk set; build transient indexes for
// injected chunk sets so tests stay isolated.
let defaultChunksRef: PortfolioChunk[] | null = null;
let defaultIndex: PortfolioIndex | null = null;

function getIndex(chunks: PortfolioChunk[]): PortfolioIndex {
	const isDefault = defaultChunksRef === chunks;
	if (isDefault && defaultIndex) return defaultIndex;

	const index = buildIndex(chunks);
	if (isDefault) defaultIndex = index;
	return index;
}

function resolveChunks(options: RetrievalOptions): PortfolioChunk[] {
	if (options.chunks) return options.chunks;
	const loaded = loadPortfolioChunks();
	if (defaultChunksRef !== loaded) {
		defaultChunksRef = loaded;
		defaultIndex = null;
	}
	return loaded;
}

const SOURCE_SIGNALS: Array<{ test: RegExp; kinds: PortfolioChunkKind[] }> = [
	{
		test: /\b(?:github|repo|repos|repository|repositories|open source)\b/,
		kinds: ["github-repo"]
	},
	{ test: /\b(?:project|projects)\b/, kinds: ["github-repo", "readme"] },
	{ test: /\b(?:linkedin)\b/, kinds: ["linkedin", "public-post"] },
	{
		test: /\b(?:writing|wrote|written|article|articles|blog|blogs|essay|essays|post|posts|publication|publications)\b/,
		kinds: ["writing", "featured", "linkedin", "public-post"]
	},
	{
		test: /\b(?:featured|talk|talks|demo|demos|highlight|highlights)\b/,
		kinds: ["featured", "public-post"]
	},
	{
		test: /\b(?:disability|disabled|accessibility|accessible|neurodiversity|neurodivergent|advocacy|advocate|inclusion)\b/,
		kinds: ["advocacy"]
	},
	{
		test: /\b(?:background|education|career|interests|profile)\b/,
		kinds: ["profile"]
	}
];

function detectSignaledKinds(normalizedQuery: string): Set<PortfolioChunkKind> {
	const kinds = new Set<PortfolioChunkKind>();
	for (const signal of SOURCE_SIGNALS) {
		if (signal.test.test(normalizedQuery)) {
			for (const kind of signal.kinds) kinds.add(kind);
		}
	}
	return kinds;
}

type ScoredChunk = {
	item: IndexedChunk;
	score: number;
	matchedAliases: string[];
};

function scoreChunk(
	item: IndexedChunk,
	queryTokens: Set<string>,
	paddedQuery: string,
	idf: Map<string, number>,
	signaledKinds: Set<PortfolioChunkKind>
): ScoredChunk {
	let score = 0;
	const matchedAliases: string[] = [];

	// 1. Exact alias match (word-boundary safe via padded normalized strings).
	for (const alias of item.normalizedAliases) {
		if (paddedQuery.includes(` ${alias} `)) {
			const extraWords = Math.min(alias.split(" ").length - 1, W_ALIAS_WORD_CAP);
			score += W_ALIAS + extraWords * W_ALIAS_WORD;
			matchedAliases.push(alias);
		}
	}

	// 2. Title token overlap.
	let titleHits = 0;
	for (const token of queryTokens) {
		if (item.titleTokens.has(token)) titleHits++;
	}
	score += titleHits * W_TITLE;

	// 3. idf-weighted keyword overlap.
	let keywordMass = 0;
	let hasStrongKeyword = false;
	for (const token of queryTokens) {
		if (item.textTokens.has(token)) {
			const weight = idf.get(token) ?? 0;
			keywordMass += weight;
			if (weight >= STRONG_IDF) hasStrongKeyword = true;
		}
	}
	score += keywordMass * W_KEYWORD;

	// 4. Source-type boost — only when the chunk already shares a strong signal with the query, so a
	// bare "github" mention does not drag in every unrelated repo.
	const hasSignal = matchedAliases.length > 0 || titleHits > 0 || hasStrongKeyword;
	if (hasSignal && signaledKinds.has(item.chunk.kind)) {
		score += W_SOURCE;
	}

	return { item, score, matchedAliases };
}

function compareScored(a: ScoredChunk, b: ScoredChunk): number {
	if (b.score !== a.score) return b.score - a.score;
	// Deterministic tie-break: alias-matched first, then stable id order.
	if (b.matchedAliases.length !== a.matchedAliases.length) {
		return b.matchedAliases.length - a.matchedAliases.length;
	}
	return a.item.chunk.id < b.item.chunk.id ? -1 : a.item.chunk.id > b.item.chunk.id ? 1 : 0;
}

function effectiveQueryText(query: string, messages?: MessageLike[]): string {
	const base = query.trim();
	if (!messages || messages.length === 0) return base;

	// Short follow-ups ("expand on that", "in markdown") carry little to retrieve on; fold in the
	// previous user turn so the prior subject is still searchable.
	if (tokenize(base).length >= 3) return base;

	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role === "user" && typeof message.content === "string") {
			const content = message.content.trim();
			if (content && content !== base) return `${base} ${content}`;
		}
	}

	return base;
}

export function retrievePortfolioContext(
	query: string,
	messages?: MessageLike[],
	options: RetrievalOptions = {}
): PortfolioRetrievalResult {
	const maxChars = positiveInt(String(options.maxChars ?? ""), DEFAULT_MAX_CHARS);
	const maxChunks = positiveInt(String(options.maxChunks ?? ""), DEFAULT_MAX_CHUNKS);
	const minScore = options.minScore ?? DEFAULT_MIN_SCORE;

	const chunks = resolveChunks(options);
	const index = getIndex(chunks);

	const effectiveQuery = effectiveQueryText(query, messages);
	const normalizedQuery = normalize(effectiveQuery);
	const paddedQuery = ` ${normalizedQuery} `;
	const queryTokens = new Set(tokenize(effectiveQuery));
	const signaledKinds = detectSignaledKinds(normalizedQuery);

	const scored = index.chunks
		.map(item => scoreChunk(item, queryTokens, paddedQuery, index.idf, signaledKinds))
		.filter(entry => entry.score >= minScore)
		.sort(compareScored);

	const selected: ScoredChunk[] = [];
	let totalChars = 0;
	let anyAliasMatch = false;

	for (const entry of scored) {
		if (entry.matchedAliases.length > 0) anyAliasMatch = true;
		if (selected.length >= maxChunks) break;
		const nextChars = totalChars + entry.item.chunk.text.length;
		if (selected.length > 0 && nextChars > maxChars) continue;
		selected.push(entry);
		totalChars = nextChars;
	}

	// Source-listing fallback: for generic "show his github projects"-style queries (a source is
	// named but no specific entity matched), surface the top chunks of that source in curated order
	// so the agent has something concrete to summarize instead of refusing.
	let usedSourceFallback = false;
	if (signaledKinds.size > 0 && !anyAliasMatch && selected.length < maxChunks) {
		const selectedIds = new Set(selected.map(entry => entry.item.chunk.id));
		for (const item of index.chunks) {
			if (selected.length >= maxChunks) break;
			if (selectedIds.has(item.chunk.id) || !signaledKinds.has(item.chunk.kind)) continue;
			const nextChars = totalChars + item.chunk.text.length;
			if (selected.length > 0 && nextChars > maxChars) continue;
			selected.push({ item, score: SOURCE_FALLBACK_SCORE, matchedAliases: [] });
			selectedIds.add(item.chunk.id);
			totalChars = nextChars;
			usedSourceFallback = true;
		}
	}

	const retrieved: RetrievedPortfolioChunk[] = selected.map(entry => ({
		id: entry.item.chunk.id,
		source: entry.item.chunk.source,
		title: entry.item.chunk.title,
		kind: entry.item.chunk.kind,
		text: entry.item.chunk.text,
		score: Number(entry.score.toFixed(3)),
		matchedAliases: entry.matchedAliases
	}));

	return {
		query: effectiveQuery,
		chunks: retrieved,
		totalChars,
		usedSourceFallback,
		debug: {
			query: effectiveQuery,
			candidateCount: scored.length,
			signaledKinds: Array.from(signaledKinds),
			usedSourceFallback,
			selected: retrieved.map(chunk => ({
				id: chunk.id,
				source: chunk.source,
				score: chunk.score,
				matchedAliases: chunk.matchedAliases
			}))
		}
	};
}

/** Render retrieved chunks into a labeled context block for the answer prompt. */
export function formatRetrievedContext(result: PortfolioRetrievalResult): string {
	if (result.chunks.length === 0) return "";
	return result.chunks.map(chunk => `[${chunk.source} — ${chunk.title}]\n${chunk.text}`).join("\n\n");
}
