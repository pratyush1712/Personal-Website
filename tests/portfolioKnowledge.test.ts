import assert from "node:assert/strict";
import { test } from "node:test";
import {
	getDynamicPortfolioEntities,
	loadPortfolioChunks,
	matchesDynamicPortfolioEntity
} from "../src/utils/agents/portfolioKnowledge";

test("loads a CleverHug GitHub chunk with the expected shape", () => {
	const chunks = loadPortfolioChunks();
	const clever = chunks.find(chunk => chunk.aliases.some(alias => /^cleverhug$/i.test(alias)));

	assert.ok(clever, "expected a CleverHug chunk to be loaded from github.md");
	assert.equal(clever.source, "GitHub");
	assert.equal(clever.kind, "github-repo");
	assert.ok(clever.id.length > 0);
	assert.ok(/email scheduler/i.test(clever.text), "CleverHug text should describe the email scheduler");
});

test("every chunk has the required fields and a unique id", () => {
	const chunks = loadPortfolioChunks();
	assert.ok(chunks.length > 0);

	for (const chunk of chunks) {
		assert.equal(typeof chunk.id, "string");
		assert.ok(chunk.id.length > 0);
		assert.equal(typeof chunk.source, "string");
		assert.equal(typeof chunk.title, "string");
		assert.equal(typeof chunk.text, "string");
		assert.ok(Array.isArray(chunk.aliases));
	}

	const ids = new Set(chunks.map(chunk => chunk.id));
	assert.equal(ids.size, chunks.length, "chunk ids must be unique");
});

test("all 27 curated repositories become github-repo chunks (no fence swallowing)", () => {
	const githubChunks = loadPortfolioChunks().filter(chunk => chunk.kind === "github-repo");
	assert.ok(githubChunks.length >= 27, `expected >= 27 github chunks, got ${githubChunks.length}`);
});

test("loads curated advocacy evidence without loading a raw LinkedIn export", () => {
	const chunks = loadPortfolioChunks();
	const advocacy = chunks.find(chunk => chunk.kind === "advocacy" && /Disability:IN/i.test(chunk.text));

	assert.ok(advocacy, "expected curated disability advocacy evidence");
	assert.match(advocacy.text, /AccessComputing/i);
	assert.match(advocacy.text, /ADHD-Friendly Text Enhancer/i);
	assert.ok(chunks.every(chunk => !/LinkedInWhole|media\.licdn/i.test(`${chunk.source}\n${chunk.text}`)));
});

test("dynamic entities include CleverHug but exclude generic section words", () => {
	const entities = getDynamicPortfolioEntities();

	assert.ok(
		entities.some(entity => /^cleverhug$/i.test(entity)),
		"CleverHug should be a dynamically-discovered entity"
	);
	assert.ok(
		!entities.some(entity => /^(?:overview|features|description|usage|installation|architecture)$/i.test(entity)),
		"generic section headings must not become entities"
	);
});

test("matchesDynamicPortfolioEntity recognizes CleverHug and rejects unrelated text", () => {
	assert.equal(matchesDynamicPortfolioEntity("What is CleverHug?"), true);
	assert.equal(matchesDynamicPortfolioEntity("tell me about the project cleverhug"), true);
	assert.equal(matchesDynamicPortfolioEntity("Explain black holes"), false);
	assert.equal(matchesDynamicPortfolioEntity("Write a LinkedIn post about crypto"), false);
	assert.equal(matchesDynamicPortfolioEntity("Explain GitHub Actions generally"), false);
});
