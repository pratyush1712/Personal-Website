export type ResponseUsage = {
	input_tokens?: number;
	input_tokens_details?: { cached_tokens?: number };
	output_tokens?: number;
	output_tokens_details?: { reasoning_tokens?: number };
	total_tokens?: number;
};

export type OpenAIResponseObject = {
	id?: string;
	model?: string;
	status?: string;
	incomplete_details?: { reason?: string } | null;
	usage?: ResponseUsage;
	output?: Array<{
		type?: string;
		content?: Array<{ type?: string; text?: string; refusal?: string }>;
	}>;
};

export type OpenAIStreamEvent = {
	type?: string;
	delta?: string;
	message?: string;
	response?: OpenAIResponseObject;
};

export const STREAM_INCOMPLETE_NOTICE =
	"\n\n_Response ended before completion. Please ask me to continue or try again._";
export const STREAM_FAILURE_NOTICE =
	"\n\n_Response interrupted because the provider connection failed. Please try again._";

/** Reasoning effort and text verbosity are GPT-5-family controls, not universal Responses fields. */
export function supportsResponsesReasoningControls(model: string): boolean {
	return /^gpt-5(?:[.-]|$)/i.test(model.trim());
}

export function buildResponsesRequest(args: {
	model: string;
	instructions: string;
	input: Array<{ role: "user" | "assistant"; content: string }>;
	maxOutputTokens: number;
	reasoningEffort: "none" | "low" | "medium" | "high";
	stream: boolean;
	safetyIdentifier?: string;
}) {
	const supportsReasoningControls = supportsResponsesReasoningControls(args.model);
	return {
		model: args.model,
		instructions: args.instructions,
		input: args.input,
		max_output_tokens: args.maxOutputTokens,
		...(supportsReasoningControls
			? {
					reasoning: { effort: args.reasoningEffort },
					text: { verbosity: "low" as const }
				}
			: {}),
		stream: args.stream,
		store: false,
		...(args.safetyIdentifier ? { safety_identifier: args.safetyIdentifier } : {})
	};
}

export function extractResponseText(response: OpenAIResponseObject): string {
	const parts: string[] = [];
	for (const item of response.output ?? []) {
		for (const content of item.content ?? []) {
			if (content.type === "output_text" && typeof content.text === "string") parts.push(content.text);
			if (content.type === "refusal" && typeof content.refusal === "string") parts.push(content.refusal);
		}
	}
	return parts.join("").trim();
}

export function parseOpenAIStreamEvent(payload: string): OpenAIStreamEvent | null {
	try {
		const parsed = JSON.parse(payload) as OpenAIStreamEvent;
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}

export function isTransientOpenAIStatus(status: number): boolean {
	return status === 408 || status === 409 || status === 429 || status >= 500;
}
