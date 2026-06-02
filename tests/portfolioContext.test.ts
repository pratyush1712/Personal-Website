import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPortfolioContext, readOptionalContextFile } from "../src/utils/agents/portfolioContext";

test("buildPortfolioContext includes optional curated agent context in stable order", () => {
	const context = buildPortfolioContext();

	const githubIndex = context.indexOf("GITHUB CONTEXT");
	const linkedinIndex = context.indexOf("LINKEDIN CONTEXT");
	const featuredIndex = context.indexOf("FEATURED POSTS AND PUBLIC CONTENT");
	const writingIndex = context.indexOf("WRITING AND ARTICLES");

	assert.ok(context.startsWith("NAME\nPratyush Sudhakar"));
	assert.ok(context.includes("LINKS\n"));
	assert.ok(githubIndex > 0);
	assert.ok(linkedinIndex > githubIndex);
	assert.ok(featuredIndex > linkedinIndex);
	assert.ok(writingIndex > featuredIndex);
});

test("readOptionalContextFile returns an empty string for missing optional files", () => {
	assert.equal(readOptionalContextFile("does-not-exist.md"), "");
});
