import assert from "node:assert/strict";
import { test } from "node:test";
import { formatResetDistance, rateLimitFromHeaders } from "../src/utils/agents/agentRateLimit";

test("parses server-authoritative hourly quota headers", () => {
	const headers = new Headers({
		"RateLimit-Limit": "100",
		"RateLimit-Remaining": "87",
		"RateLimit-Reset": "3600",
		"X-RateLimit-Scope": "hour"
	});
	const result = rateLimitFromHeaders(headers, 200);

	assert.ok(result);
	assert.equal(result.limit, 100);
	assert.equal(result.remaining, 87);
	assert.equal(result.limited, false);
	assert.equal(result.scope, "hour");
	assert.ok(result.resetAt > Date.now() + 3_500_000);
});

test("429 plus Retry-After takes precedence and disables the client until reset", () => {
	const before = Date.now();
	const result = rateLimitFromHeaders(
		new Headers({
			"RateLimit-Limit": "10",
			"RateLimit-Remaining": "0",
			"RateLimit-Reset": "60",
			"Retry-After": "12",
			"X-RateLimit-Scope": "minute"
		}),
		429
	);

	assert.ok(result);
	assert.equal(result.limited, true);
	assert.equal(result.scope, "minute");
	assert.ok(result.resetAt >= before + 12_000);
	assert.equal(formatResetDistance(result.resetAt), "about 1 minute");
});
