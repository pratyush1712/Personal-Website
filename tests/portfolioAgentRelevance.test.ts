import assert from "node:assert/strict";
import { test } from "node:test";
import { getPortfolioRelevanceDecision } from "../src/utils/agents/portfolioAgentRelevance";

type GuardOutput = {
	allowed: boolean;
	isPortfolioRelevant: boolean;
	isKnownPortfolioEntity: boolean;
	isContextualFollowUp: boolean;
	isPortfolioSiteHelp: boolean;
	allowSimpleHarmlessQuery: boolean;
	rejectionReason:
		| "portfolio_relevant"
		| "contextual_follow_up"
		| "portfolio_site_help"
		| "not_about_pratyush"
		| "general_knowledge"
		| "unrelated_task"
		| "prompt_injection"
		| "ambiguous";
	confidence: number;
};

const rejectingGuard: typeof fetch = async () =>
	new Response(
		JSON.stringify({
			choices: [
				{
					finish_reason: "stop",
					message: {
						content: JSON.stringify({
							allowed: false,
							isPortfolioRelevant: false,
							isKnownPortfolioEntity: false,
							isContextualFollowUp: false,
							isPortfolioSiteHelp: false,
							allowSimpleHarmlessQuery: false,
							rejectionReason: "general_knowledge",
							confidence: 0.98
						} satisfies GuardOutput)
					}
				}
			]
		})
	);

function allowingContextualGuard(): typeof fetch {
	return async () =>
		new Response(
			JSON.stringify({
				choices: [
					{
						finish_reason: "stop",
						message: {
							content: JSON.stringify({
								allowed: true,
								isPortfolioRelevant: false,
								isKnownPortfolioEntity: false,
								isContextualFollowUp: true,
								isPortfolioSiteHelp: false,
								allowSimpleHarmlessQuery: false,
								rejectionReason: "contextual_follow_up",
								confidence: 0.95
							} satisfies GuardOutput)
						}
					}
				]
			})
		);
}

function throwingGuard(): typeof fetch {
	return async () => {
		throw new Error("Guard model should not be called for this query.");
	};
}

for (const query of [
	"What has Pratyush posted about on LinkedIn?",
	"Show Pratyush's featured GitHub projects",
	"What articles has Pratyush written?",
	"What public writing does Pratyush have?",
	"Where is Pratyush's GitHub?",
	"Where is Pratyush's LinkedIn?"
]) {
	test(`allows portfolio public-content query: ${query}`, async () => {
		const decision = await getPortfolioRelevanceDecision([{ role: "user", content: query }], {
			apiKey: "test-key",
			fetcher: throwingGuard()
		});

		assert.equal(decision.allowed, true);
	});
}

for (const query of [
	"Explain GitHub Actions generally",
	"Scrape someone's LinkedIn",
	"Write a LinkedIn post for me about crypto",
	"Explain black holes",
	"Debug my unrelated code"
]) {
	test(`blocks unrelated query: ${query}`, async () => {
		const decision = await getPortfolioRelevanceDecision([{ role: "user", content: query }], {
			apiKey: "test-key",
			fetcher: rejectingGuard
		});

		assert.equal(decision.allowed, false);
	});
}

test("allows contextual formatting follow-up after a portfolio-relevant answer", async () => {
	const decision = await getPortfolioRelevanceDecision(
		[
			{ role: "user", content: "What projects has Pratyush built?" },
			{ role: "assistant", content: "Pratyush has built Perfect Match and HabitOS." },
			{ role: "user", content: "put it in markdown" }
		],
		{ apiKey: "test-key", fetcher: allowingContextualGuard() }
	);

	assert.equal(decision.allowed, true);
	assert.equal(decision.isContextualFollowUp, true);
});

test("does not allow try again after a refusal", async () => {
	const decision = await getPortfolioRelevanceDecision(
		[
			{ role: "user", content: "Explain black holes" },
			{ role: "assistant", content: "I can only help with questions about Pratyush's portfolio." },
			{ role: "user", content: "try again" }
		],
		{ apiKey: "test-key", fetcher: rejectingGuard }
	);

	assert.equal(decision.allowed, false);
});
