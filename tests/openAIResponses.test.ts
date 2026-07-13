import assert from "node:assert/strict";
import { test } from "node:test";
import {
	buildResponsesRequest,
	extractResponseText,
	isTransientOpenAIStatus,
	parseOpenAIStreamEvent,
	STREAM_FAILURE_NOTICE,
	STREAM_INCOMPLETE_NOTICE,
	supportsResponsesReasoningControls
} from "../src/utils/agents/openAIResponses";

test("builds a low-reasoning Responses API request without storage", () => {
	const body = buildResponsesRequest({
		model: "gpt-5.6-terra",
		instructions: "portfolio instructions",
		input: [{ role: "user", content: "hello" }],
		maxOutputTokens: 900,
		reasoningEffort: "low",
		stream: true,
		safetyIdentifier: "safe-user"
	});

	assert.equal(body.model, "gpt-5.6-terra");
	assert.deepEqual(body.reasoning, { effort: "low" });
	assert.deepEqual(body.text, { verbosity: "low" });
	assert.equal(body.store, false);
	assert.equal(body.stream, true);
	assert.equal(body.safety_identifier, "safe-user");
});

test("omits GPT-5-only controls for model overrides without that capability", () => {
	const body = buildResponsesRequest({
		model: "gpt-4.1-mini",
		instructions: "portfolio instructions",
		input: [{ role: "user", content: "hello" }],
		maxOutputTokens: 900,
		reasoningEffort: "low",
		stream: false
	});

	assert.equal(supportsResponsesReasoningControls("gpt-5.6-terra"), true);
	assert.equal(supportsResponsesReasoningControls("gpt-4.1-mini"), false);
	assert.equal("reasoning" in body, false);
	assert.equal("text" in body, false);
});

test("extracts output text and refusal content from a completed response", () => {
	assert.equal(
		extractResponseText({
			output: [
				{
					type: "message",
					content: [{ type: "output_text", text: "Supported answer." }]
				},
				{
					type: "message",
					content: [{ type: "refusal", refusal: " Boundary." }]
				}
			]
		}),
		"Supported answer. Boundary."
	);
});

test("parses Responses API stream events and recognizes transient statuses", () => {
	assert.deepEqual(parseOpenAIStreamEvent('{"type":"response.output_text.delta","delta":"Hi"}'), {
		type: "response.output_text.delta",
		delta: "Hi"
	});
	assert.equal(parseOpenAIStreamEvent("not json"), null);
	assert.equal(isTransientOpenAIStatus(429), true);
	assert.equal(isTransientOpenAIStatus(503), true);
	assert.equal(isTransientOpenAIStatus(400), false);
});

test("stream terminal notices make incomplete and failed partial replies explicit", () => {
	assert.match(STREAM_INCOMPLETE_NOTICE, /ended before completion/i);
	assert.match(STREAM_FAILURE_NOTICE, /interrupted/i);
});
