import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";
import { PORTFOLIO_AGENT_SOURCES } from "../src/utils/agents/portfolioSources";

test("source manifest is explicit and excludes raw LinkedIn exports", () => {
  const paths = PORTFOLIO_AGENT_SOURCES.map(
    (source) => `${source.relativeDir}/${source.fileName}`,
  );
  assert.ok(paths.includes("content/portfolio-agent/advocacy-and-values.md"));
  assert.ok(paths.includes("public/agent-context/github.md"));
  assert.ok(paths.every((path) => !/LinkedInWhole|LinkedinData/i.test(path)));
});

test("raw LinkedIn export is not deployable and ignore rules prevent re-adding it", () => {
  assert.equal(
    existsSync(join(process.cwd(), "public/agent-context/LinkedInWhole.md")),
    false,
  );
  const ignore = readFileSync(join(process.cwd(), ".gitignore"), "utf8");
  assert.match(ignore, /\*\*\/LinkedInWhole\.md/);
  assert.match(ignore, /\*\*\/LinkedinData\//);
});
