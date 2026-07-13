import type { ResponseUsage } from "./openAIResponses";

const MODEL_PRICES_PER_MILLION: Record<string, { input: number; cachedInput: number; output: number }> = {
	"gpt-5.6-terra": { input: 2.5, cachedInput: 0.25, output: 15 },
	"gpt-5.6-luna": { input: 1, cachedInput: 0.1, output: 6 }
};

export function estimateResponseCostUsd(model: string, usage?: ResponseUsage): number | undefined {
	const price = MODEL_PRICES_PER_MILLION[model];
	if (!price || !usage) return undefined;
	const input = Math.max(0, usage.input_tokens ?? 0);
	const cached = Math.min(input, Math.max(0, usage.input_tokens_details?.cached_tokens ?? 0));
	const uncached = input - cached;
	const output = Math.max(0, usage.output_tokens ?? 0);
	return (uncached * price.input + cached * price.cachedInput + output * price.output) / 1_000_000;
}

export function logPortfolioAgentTelemetry(event: {
	requestId: string;
	model: string;
	fallbackFrom?: string;
	durationMs: number;
	timeToFirstTokenMs?: number;
	retrievalMode: string;
	retrievedChunkIds: string[];
	status: string;
	usage?: ResponseUsage;
}) {
	console.info(
		"[portfolio-agent][telemetry]",
		JSON.stringify({
			...event,
			estimatedCostUsd: estimateResponseCostUsd(event.model, event.usage)
		})
	);
}
