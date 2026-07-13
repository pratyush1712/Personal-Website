import assert from "node:assert/strict";
import { test } from "node:test";
import type { PortfolioChunk } from "../src/utils/agents/portfolioKnowledge";
import { retrievePortfolioContext } from "../src/utils/agents/portfolioRetriever";

// --- Tests against the real knowledge base (public/agent-context/github.md contains CleverHug) ---

test("retrieves the CleverHug chunk for 'What is CleverHug?'", () => {
	const result = retrievePortfolioContext("What is CleverHug?");

	assert.ok(result.chunks.length >= 1, "expected at least one retrieved chunk");
	const top = result.chunks[0];
	assert.match(top.id, /cleverhug/i);
	assert.equal(top.source, "GitHub");
	assert.ok(top.matchedAliases.some(alias => /cleverhug/i.test(alias)));
});

test("retrieves CleverHug for the GitHub-qualified phrasing", () => {
	const result = retrievePortfolioContext("What is the project CleverHug on Pratyush's GitHub?");
	assert.ok(result.chunks.some(chunk => /cleverhug/i.test(chunk.id)));
});

test("returns zero chunks for an unrelated query so the prompt can answer briefly without inventing portfolio facts", () => {
	const result = retrievePortfolioContext("Explain black holes");
	assert.equal(result.chunks.length, 0);
});

test("retrieves multiple sources for a disability-advocacy assessment", () => {
	const result = retrievePortfolioContext("Is Pratyush an advocate for disability rights?");

	assert.ok(result.chunks.some(chunk => chunk.kind === "advocacy"));
	assert.ok(result.chunks.some(chunk => /Disability:IN|AccessComputing|Tapia/i.test(chunk.text)));
});

test("retrieves a Perfect Match chunk", () => {
	const result = retrievePortfolioContext("What is Perfect Match?");
	assert.ok(result.chunks.length >= 1);
	assert.ok(
		result.chunks.some(chunk => /perfect-match/i.test(chunk.id) || /perfect match/i.test(chunk.text)),
		"expected a Perfect Match chunk in the results"
	);
});

test("caps retrieved context to the requested char budget", () => {
	const result = retrievePortfolioContext("What is Perfect Match?", undefined, {
		maxChars: 3000
	});
	// The first chunk is always included even if it alone exceeds the budget; after that the budget holds.
	assert.ok(result.totalChars <= 3000 || result.chunks.length === 1);
});

test("retrieval is deterministic", () => {
	const a = retrievePortfolioContext("What is CleverHug?");
	const b = retrievePortfolioContext("What is CleverHug?");
	assert.deepEqual(
		a.chunks.map(chunk => [chunk.id, chunk.score]),
		b.chunks.map(chunk => [chunk.id, chunk.score])
	);
});

test("folds the previous user turn into a short follow-up", () => {
	const messages = [
		{ role: "user", content: "What is CleverHug?" },
		{ role: "assistant", content: "CleverHug is an email scheduler." },
		{ role: "user", content: "put it in markdown" }
	];
	const result = retrievePortfolioContext("put it in markdown", messages);
	assert.ok(result.chunks.some(chunk => /cleverhug/i.test(chunk.id)));
});

// --- Algorithm tests against injected chunks (independent of the real data) ---

const injected: PortfolioChunk[] = [
	{
		id: "x:clever",
		source: "GitHub",
		title: "owner/CleverHug",
		kind: "github-repo",
		text: "CleverHug is an email scheduler application built with Flask and React.",
		aliases: ["CleverHug", "owner CleverHug"]
	},
	{
		id: "x:other",
		source: "GitHub",
		title: "owner/other-tool",
		kind: "github-repo",
		text: "An unrelated tool about spreadsheets and invoices.",
		aliases: ["other-tool"]
	},
	{
		id: "x:noise",
		source: "Portfolio: skills",
		title: "Skills",
		kind: "readme",
		text: "Python, TypeScript, React, and Node.js.",
		aliases: []
	}
];

test("ranks an exact alias match above everything else", () => {
	const result = retrievePortfolioContext("What is CleverHug?", undefined, {
		chunks: injected
	});
	assert.equal(result.chunks[0].id, "x:clever");
	assert.ok(result.chunks[0].matchedAliases.includes("cleverhug"));
});

test("an unrelated query over injected chunks returns nothing", () => {
	const result = retrievePortfolioContext("photosynthesis in plants", undefined, { chunks: injected });
	assert.equal(result.chunks.length, 0);
});
