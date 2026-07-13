import type { PortfolioChunkKind } from "./portfolioKnowledge";

export type PortfolioSource = {
  relativeDir: string;
  fileName: string;
  source: string;
  kind: PortfolioChunkKind;
  header: string;
  priority: number;
  boundary: "github-repositories" | "level-two";
};

/**
 * Explicit allow-list of sources the Portfolio Agent may treat as factual evidence.
 * Raw exports and arbitrary files must never be discovered by directory scanning.
 */
export const PORTFOLIO_AGENT_SOURCES: readonly PortfolioSource[] = [
  {
    relativeDir: "content/portfolio-agent",
    fileName: "profile.md",
    source: "Current profile",
    kind: "profile",
    header: "CURRENT PROFILE",
    priority: 100,
    boundary: "level-two",
  },
  {
    relativeDir: "content/portfolio-agent",
    fileName: "advocacy-and-values.md",
    source: "Advocacy and values",
    kind: "advocacy",
    header: "ADVOCACY, ACCESSIBILITY, AND VALUES",
    priority: 95,
    boundary: "level-two",
  },
  {
    relativeDir: "content/portfolio-agent",
    fileName: "linkedin-posts.md",
    source: "Selected LinkedIn posts",
    kind: "public-post",
    header: "SELECTED PUBLIC LINKEDIN POSTS",
    priority: 85,
    boundary: "level-two",
  },
  {
    relativeDir: "content/portfolio-agent",
    fileName: "writing.md",
    source: "Writing",
    kind: "writing",
    header: "WRITING AND PUBLICATIONS",
    priority: 80,
    boundary: "level-two",
  },
  {
    relativeDir: "public/agent-context",
    fileName: "github.md",
    source: "GitHub",
    kind: "github-repo",
    header: "GITHUB CONTEXT",
    priority: 50,
    boundary: "github-repositories",
  },
];
