import { loadPortfolioChunks, type PortfolioChunk } from "./portfolioKnowledge";
import {
  retrievePortfolioContext,
  type PortfolioRetrievalResult,
  type RetrievalOptions,
  type RetrievedPortfolioChunk,
} from "./portfolioRetriever";

export type EmbedTexts = (inputs: string[]) => Promise<number[][]>;

export type HybridRetrievalOptions = RetrievalOptions & {
  apiKey?: string;
  embedTexts?: EmbedTexts;
  semanticMinSimilarity?: number;
};

export type HybridPortfolioRetrievalResult = PortfolioRetrievalResult & {
  debug: PortfolioRetrievalResult["debug"] & {
    mode: "hybrid" | "lexical-fallback";
    semanticAttempted: boolean;
    semanticFailureReason?: string;
    embeddingModel?: string;
  };
};

const EMBEDDING_MODEL =
  process.env.PORTFOLIO_AGENT_EMBEDDING_MODEL ?? "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = positiveInt(
  process.env.PORTFOLIO_AGENT_EMBEDDING_DIMENSIONS,
  512,
);
const EMBEDDING_TIMEOUT_MS = positiveInt(
  process.env.PORTFOLIO_AGENT_EMBEDDING_TIMEOUT_MS,
  6_000,
);
const DEFAULT_SEMANTIC_MIN_SIMILARITY = positiveFloat(
  process.env.PORTFOLIO_AGENT_SEMANTIC_MIN_SIMILARITY,
  0.28,
);
const DEFAULT_MAX_CHARS = positiveInt(
  process.env.PORTFOLIO_AGENT_RETRIEVAL_MAX_CHARS,
  8_000,
);
const DEFAULT_MAX_CHUNKS = positiveInt(
  process.env.PORTFOLIO_AGENT_RETRIEVAL_MAX_CHUNKS,
  6,
);
const RRF_K = 60;

let cachedCorpusRef: PortfolioChunk[] | null = null;
let cachedCorpusPromise: Promise<number[][]> | null = null;
const queryEmbeddingCache = new Map<string, number[]>();

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function positiveFloat(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function canonicalPortfolioEmbeddingText(chunk: PortfolioChunk): string {
  return [
    `Title: ${chunk.title}`,
    `Source: ${chunk.source}`,
    `Aliases: ${chunk.aliases.join(", ")}`,
    chunk.text,
  ]
    .filter(Boolean)
    .join("\n");
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return -1;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) return -1;
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA > 0 && normB > 0 ? dot / Math.sqrt(normA * normB) : -1;
}

function defaultEmbedder(apiKey: string): EmbedTexts {
  return async (inputs) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), EMBEDDING_TIMEOUT_MS);
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          dimensions: EMBEDDING_DIMENSIONS,
          input: inputs,
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`embedding_http_${response.status}`);
      const data = (await response.json()) as {
        data?: Array<{ index?: number; embedding?: unknown }>;
      };
      const ordered = [...(data.data ?? [])].sort(
        (a, b) => (a.index ?? 0) - (b.index ?? 0),
      );
      if (ordered.length !== inputs.length)
        throw new Error("embedding_count_mismatch");
      return ordered.map((item) => {
        if (
          !Array.isArray(item.embedding) ||
          !item.embedding.every((value) => typeof value === "number")
        ) {
          throw new Error("invalid_embedding_vector");
        }
        return item.embedding as number[];
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}

async function corpusEmbeddings(
  chunks: PortfolioChunk[],
  embed: EmbedTexts,
  cacheable: boolean,
): Promise<number[][]> {
  if (!cacheable) return embed(chunks.map(canonicalPortfolioEmbeddingText));
  if (cachedCorpusRef !== chunks || !cachedCorpusPromise) {
    cachedCorpusRef = chunks;
    cachedCorpusPromise = embed(
      chunks.map(canonicalPortfolioEmbeddingText),
    ).catch((error) => {
      cachedCorpusPromise = null;
      throw error;
    });
  }
  return cachedCorpusPromise;
}

async function queryEmbedding(
  query: string,
  embed: EmbedTexts,
  cacheable: boolean,
): Promise<number[]> {
  if (cacheable) {
    const cached = queryEmbeddingCache.get(query);
    if (cached) return cached;
  }
  const [vector] = await embed([query]);
  if (!vector) throw new Error("missing_query_embedding");
  if (cacheable) {
    queryEmbeddingCache.set(query, vector);
    if (queryEmbeddingCache.size > 50)
      queryEmbeddingCache.delete(
        queryEmbeddingCache.keys().next().value as string,
      );
  }
  return vector;
}

function lexicalFallback(
  result: PortfolioRetrievalResult,
  reason: string,
  attempted: boolean,
): HybridPortfolioRetrievalResult {
  return {
    ...result,
    debug: {
      ...result.debug,
      mode: "lexical-fallback",
      semanticAttempted: attempted,
      semanticFailureReason: reason,
      embeddingModel: EMBEDDING_MODEL,
    },
  };
}

export async function retrievePortfolioContextHybrid(
  query: string,
  messages?: Array<{ role: string; content: string }>,
  options: HybridRetrievalOptions = {},
): Promise<HybridPortfolioRetrievalResult> {
  const lexical = retrievePortfolioContext(query, messages, options);
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const embed = options.embedTexts ?? (apiKey ? defaultEmbedder(apiKey) : null);
  if (!embed)
    return lexicalFallback(lexical, "embedding_not_configured", false);

  const chunks = options.chunks ?? loadPortfolioChunks();
  if (chunks.length === 0 || !lexical.query.trim())
    return lexicalFallback(lexical, "empty_corpus_or_query", false);

  try {
    const cacheable = !options.chunks && !options.embedTexts;
    const [corpus, queryVector] = await Promise.all([
      corpusEmbeddings(chunks, embed, cacheable),
      queryEmbedding(lexical.query, embed, cacheable),
    ]);
    if (corpus.length !== chunks.length)
      return lexicalFallback(lexical, "embedding_count_mismatch", true);

    const threshold =
      options.semanticMinSimilarity ?? DEFAULT_SEMANTIC_MIN_SIMILARITY;
    const semantic = chunks
      .map((chunk, index) => ({
        chunk,
        similarity: cosineSimilarity(queryVector, corpus[index] ?? []),
      }))
      .filter((item) => item.similarity >= threshold)
      .sort(
        (a, b) =>
          b.similarity - a.similarity ||
          (b.chunk.priority ?? 0) - (a.chunk.priority ?? 0),
      );
    if (semantic.length === 0)
      return lexicalFallback(lexical, "no_semantic_match", true);

    const lexicalById = new Map(
      lexical.chunks.map((chunk, index) => [
        chunk.id,
        { chunk, rank: index + 1 },
      ]),
    );
    const semanticById = new Map(
      semantic.map((item, index) => [
        item.chunk.id,
        { ...item, rank: index + 1 },
      ]),
    );
    const candidateIds = new Set([
      ...lexicalById.keys(),
      ...semanticById.keys(),
    ]);

    const ranked = [...candidateIds]
      .map((id) => {
        const lexicalEntry = lexicalById.get(id);
        const semanticEntry = semanticById.get(id);
        const source = lexicalEntry?.chunk;
        const base = source ?? semanticEntry?.chunk;
        if (!base) return null;
        const aliasBoost = source?.matchedAliases.length ? 1 : 0;
        const fused =
          aliasBoost +
          (lexicalEntry ? 0.55 / (RRF_K + lexicalEntry.rank) : 0) +
          (semanticEntry ? 0.45 / (RRF_K + semanticEntry.rank) : 0);
        const chunk: RetrievedPortfolioChunk = source ?? {
          id: base.id,
          source: base.source,
          title: base.title,
          kind: base.kind,
          text: base.text,
          score: 0,
          matchedAliases: [],
        };
        return {
          chunk: { ...chunk, score: Number((fused * 1_000).toFixed(3)) },
          fused,
        };
      })
      .filter(
        (item): item is { chunk: RetrievedPortfolioChunk; fused: number } =>
          item !== null,
      )
      .sort(
        (a, b) => b.fused - a.fused || a.chunk.id.localeCompare(b.chunk.id),
      );

    const maxChunks = options.maxChunks ?? DEFAULT_MAX_CHUNKS;
    const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
    const selected: RetrievedPortfolioChunk[] = [];
    let totalChars = 0;
    for (const item of ranked) {
      if (selected.length >= maxChunks) break;
      const nextChars = totalChars + item.chunk.text.length;
      if (selected.length > 0 && nextChars > maxChars) continue;
      selected.push(item.chunk);
      totalChars = nextChars;
    }

    return {
      ...lexical,
      chunks: selected,
      totalChars,
      debug: {
        ...lexical.debug,
        mode: "hybrid",
        semanticAttempted: true,
        embeddingModel: EMBEDDING_MODEL,
        selected: selected.map((chunk) => ({
          id: chunk.id,
          source: chunk.source,
          score: chunk.score,
          matchedAliases: chunk.matchedAliases,
        })),
      },
    };
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message.slice(0, 80)
        : "semantic_retrieval_failed";
    return lexicalFallback(lexical, reason, true);
  }
}

export function __resetPortfolioEmbeddingCache(): void {
  cachedCorpusRef = null;
  cachedCorpusPromise = null;
  queryEmbeddingCache.clear();
}
