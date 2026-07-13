import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildPortfolioContext,
  readOptionalContextFile,
} from "../src/utils/agents/portfolioContext";

test("buildPortfolioContext includes only allow-listed curated context in stable order", () => {
  const context = buildPortfolioContext();

  const profileIndex = context.indexOf("CURRENT PROFILE");
  const advocacyIndex = context.indexOf("ADVOCACY, ACCESSIBILITY, AND VALUES");
  const postsIndex = context.indexOf("SELECTED PUBLIC LINKEDIN POSTS");
  const writingIndex = context.indexOf("WRITING AND PUBLICATIONS");
  const githubIndex = context.indexOf("GITHUB CONTEXT");

  assert.ok(context.startsWith("NAME\nPratyush Sudhakar"));
  assert.ok(context.includes("LINKS\n"));
  assert.ok(profileIndex > 0);
  assert.ok(advocacyIndex > profileIndex);
  assert.ok(postsIndex > advocacyIndex);
  assert.ok(writingIndex > postsIndex);
  assert.ok(githubIndex > writingIndex);
  assert.match(context, /December 2026/i);
  assert.doesNotMatch(
    context,
    /LinkedInWhole|licence credential id|media\.licdn/i,
  );
});

test("readOptionalContextFile returns an empty string for missing optional files", () => {
  assert.equal(readOptionalContextFile("does-not-exist.md"), "");
});
