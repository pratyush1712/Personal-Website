import assert from "node:assert/strict";
import { test } from "node:test";
import {
	__expirePortfolioRateLimitMinuteWindowForTests,
	__resetPortfolioRateLimitMemoryForTests,
	consumePortfolioRateLimit,
	portfolioRateLimitHeaders
} from "../src/utils/agents/portfolioRateLimit.server";

function requestFor(address: string) {
	return {
		headers: {
			get(name: string) {
				return name.toLowerCase() === "x-forwarded-for" ? address : null;
			}
		}
	};
}

test("minute-limited retries do not spend the hourly answer budget", async () => {
	delete process.env.KV_REST_API_URL;
	delete process.env.KV_REST_API_TOKEN;
	delete process.env.UPSTASH_REDIS_REST_URL;
	delete process.env.UPSTASH_REDIS_REST_TOKEN;
	__resetPortfolioRateLimitMemoryForTests();
	const req = requestFor("203.0.113.10");

	for (let index = 0; index < 10; index += 1) {
		const result = await consumePortfolioRateLimit(req);
		assert.equal(result.allowed, true);
	}

	const firstDenied = await consumePortfolioRateLimit(req);
	assert.equal(firstDenied.allowed, false);
	assert.equal(firstDenied.scope, "minute");

	for (let index = 0; index < 25; index += 1) {
		const retry = await consumePortfolioRateLimit(req);
		assert.equal(retry.allowed, false);
		assert.equal(retry.scope, "minute");
	}

	__expirePortfolioRateLimitMinuteWindowForTests(req);
	const afterMinuteReset = await consumePortfolioRateLimit(req);
	assert.equal(afterMinuteReset.allowed, true);
	assert.equal(afterMinuteReset.remaining, 89);

	const headers = portfolioRateLimitHeaders(firstDenied);
	assert.equal(headers["X-RateLimit-Scope"], "minute");
	assert.equal(headers["X-RateLimit-Backend"], "memory");
});
