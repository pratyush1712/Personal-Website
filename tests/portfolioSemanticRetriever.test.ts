import assert from "node:assert/strict";
import { test } from "node:test";
import type { PortfolioChunk } from "../src/utils/agents/portfolioKnowledge";
import { retrievePortfolioContextHybrid } from "../src/utils/agents/portfolioSemanticRetriever";

const chunks: PortfolioChunk[] = [
  {
    id: "advocacy",
    source: "Advocacy and values",
    title: "Disability and neurodiversity advocacy",
    kind: "advocacy",
    text: "AccessComputing, Disability:IN, Tapia, and accessible innovation.",
    aliases: ["accessibility advocate"],
  },
  {
    id: "systems",
    source: "Current profile",
    title: "Engineering focus",
    kind: "profile",
    text: "Backend architecture, data pipelines, and service boundaries.",
    aliases: ["engineering focus"],
  },
];

test("semantic retrieval finds conceptually relevant evidence when lexical retrieval has no match", async () => {
  const embedTexts = async (inputs: string[]) =>
    inputs.map((input) => {
      const normalized = input.toLowerCase();
      return normalized.includes("equal access") ||
        normalized.includes("disability and neurodiversity")
        ? [1, 0]
        : [0, 1];
    });
  const result = await retrievePortfolioContextHybrid(
    "Does his work promote equal access?",
    undefined,
    {
      chunks,
      embedTexts,
      semanticMinSimilarity: 0.8,
    },
  );

  assert.equal(result.debug.mode, "hybrid");
  assert.equal(result.chunks[0].id, "advocacy");
});

test("embedding failure preserves the deterministic lexical result", async () => {
  const result = await retrievePortfolioContextHybrid(
    "What is his engineering focus?",
    undefined,
    {
      chunks,
      embedTexts: async () => {
        throw new Error("offline");
      },
    },
  );

  assert.equal(result.debug.mode, "lexical-fallback");
  assert.match(result.debug.semanticFailureReason ?? "", /offline/);
  assert.equal(result.chunks[0].id, "systems");
});
