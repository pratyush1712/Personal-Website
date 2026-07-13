import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { composePortfolioInstructions } from "@/utils/agents/agentPrompts";
import { buildPolicyReminder, detectPortfolioRiskFlags } from "@/utils/agents/portfolioAgentPolicy";
import {
	buildResponsesRequest,
	extractResponseText,
	isTransientOpenAIStatus,
	parseOpenAIStreamEvent,
	STREAM_FAILURE_NOTICE,
	STREAM_INCOMPLETE_NOTICE,
	type OpenAIResponseObject,
	type ResponseUsage
} from "@/utils/agents/openAIResponses";
import { formatRetrievedContext } from "@/utils/agents/portfolioRetriever";
import { retrievePortfolioContextHybrid } from "@/utils/agents/portfolioSemanticRetriever";
import {
	consumePortfolioRateLimit,
	PortfolioRateLimitUnavailableError,
	portfolioRateLimitHeaders,
	portfolioSafetyIdentifier,
	type PortfolioRateLimitResult
} from "@/utils/agents/portfolioRateLimit.server";
import { logPortfolioAgentTelemetry } from "@/utils/agents/portfolioAgentTelemetry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 10;
const MAX_BODY_CHARS = 32_000;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_CONTEXT_CHARS = positiveInt(process.env.PORTFOLIO_AGENT_MAX_CONTEXT_CHARS, 12_000);
const OPENAI_MODEL = process.env.PORTFOLIO_AGENT_MODEL ?? "gpt-5.6-terra";
const OPENAI_FALLBACK_MODEL = process.env.PORTFOLIO_AGENT_FALLBACK_MODEL ?? "gpt-5.6-luna";
const OPENAI_MAX_OUTPUT_TOKENS = positiveInt(process.env.PORTFOLIO_AGENT_MAX_COMPLETION_TOKENS, 900);
const OPENAI_REASONING_EFFORT = reasoningEffort(process.env.PORTFOLIO_AGENT_REASONING_EFFORT);
const PUBLIC_UNAVAILABLE = "Portfolio Agent is temporarily unavailable. Please try again shortly.";
const EMPTY_RESPONSE = "I could not produce a useful answer. Try a shorter or more specific question.";

type ClientMessage = { role: "user" | "assistant"; content: string };
type RequestBody = {
	messages?: unknown;
	currentPage?: unknown;
	stream?: unknown;
};

type StartedOpenAIResponse = {
	response: Response;
	controller: AbortController;
	model: string;
	fallbackFrom?: string;
};

class OpenAIStartError extends Error {
	constructor(readonly status: number) {
		super("OpenAI request failed");
	}
}

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function reasoningEffort(value: string | undefined): "none" | "low" | "medium" | "high" {
	return value === "none" || value === "medium" || value === "high" ? value : "low";
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
	return Response.json(data, {
		status,
		headers: { ...headers, "Cache-Control": "no-store" }
	});
}

function sanitizeMessages(messages: unknown): ClientMessage[] {
	if (!Array.isArray(messages)) return [];
	return messages
		.slice(-MAX_MESSAGES)
		.filter((message): message is ClientMessage => {
			if (!message || typeof message !== "object") return false;
			const candidate = message as Partial<ClientMessage>;
			return (
				(candidate.role === "user" || candidate.role === "assistant") &&
				typeof candidate.content === "string" &&
				candidate.content.trim().length > 0
			);
		})
		.map(message => ({
			role: message.role,
			content: message.content.trim().slice(0, MAX_MESSAGE_CHARS)
		}));
}

function normalizeCurrentPage(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed.slice(0, 120) : undefined;
}

function latestUserContent(messages: ClientMessage[]): string {
	return messages[messages.length - 1]?.role === "user" ? messages[messages.length - 1].content : "";
}

function capContext(context: string): string {
	return context.length > MAX_CONTEXT_CHARS ? `${context.slice(0, MAX_CONTEXT_CHARS)}\n…(truncated)` : context;
}

function linkedController(requestSignal: AbortSignal): AbortController {
	const controller = new AbortController();
	if (requestSignal.aborted) controller.abort(requestSignal.reason);
	else requestSignal.addEventListener("abort", () => controller.abort(requestSignal.reason), { once: true });
	return controller;
}

async function callResponsesAPI(args: {
	model: string;
	instructions: string;
	messages: ClientMessage[];
	stream: boolean;
	apiKey: string;
	safetyIdentifier: string;
	requestSignal: AbortSignal;
}): Promise<{ response: Response; controller: AbortController }> {
	const controller = linkedController(args.requestSignal);
	const response = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${args.apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(
			buildResponsesRequest({
				model: args.model,
				instructions: args.instructions,
				input: args.messages,
				maxOutputTokens: OPENAI_MAX_OUTPUT_TOKENS,
				reasoningEffort: OPENAI_REASONING_EFFORT,
				stream: args.stream,
				safetyIdentifier: args.safetyIdentifier
			})
		),
		signal: controller.signal
	});
	return { response, controller };
}

async function startOpenAI(args: {
	instructions: string;
	messages: ClientMessage[];
	stream: boolean;
	apiKey: string;
	safetyIdentifier: string;
	requestSignal: AbortSignal;
}): Promise<StartedOpenAIResponse> {
	const primary = await callResponsesAPI({ ...args, model: OPENAI_MODEL });
	if (primary.response.ok) return { ...primary, model: OPENAI_MODEL };

	const primaryStatus = primary.response.status;
	primary.controller.abort();
	void primary.response.body?.cancel();
	if (OPENAI_FALLBACK_MODEL && OPENAI_FALLBACK_MODEL !== OPENAI_MODEL && isTransientOpenAIStatus(primaryStatus)) {
		const fallback = await callResponsesAPI({
			...args,
			model: OPENAI_FALLBACK_MODEL
		});
		if (fallback.response.ok) {
			return {
				...fallback,
				model: OPENAI_FALLBACK_MODEL,
				fallbackFrom: OPENAI_MODEL
			};
		}
		const status = fallback.response.status;
		fallback.controller.abort();
		void fallback.response.body?.cancel();
		throw new OpenAIStartError(status);
	}

	throw new OpenAIStartError(primaryStatus);
}

async function createNonStreamingReply(args: {
	started: StartedOpenAIResponse;
	requestId: string;
	startedAt: number;
	retrievalMode: string;
	retrievedChunkIds: string[];
}): Promise<string> {
	const data = (await args.started.response.json()) as OpenAIResponseObject;
	const reply = extractResponseText(data);
	logPortfolioAgentTelemetry({
		requestId: args.requestId,
		model: args.started.model,
		fallbackFrom: args.started.fallbackFrom,
		durationMs: Date.now() - args.startedAt,
		retrievalMode: args.retrievalMode,
		retrievedChunkIds: args.retrievedChunkIds,
		status: data.status ?? "completed",
		usage: data.usage
	});
	return reply || EMPTY_RESPONSE;
}

function createStreamingReply(args: {
	started: StartedOpenAIResponse;
	headers: Record<string, string>;
	requestId: string;
	startedAt: number;
	retrievalMode: string;
	retrievedChunkIds: string[];
}): Response {
	const upstream = args.started.response.body;
	if (!upstream) {
		args.started.controller.abort();
		return json({ error: PUBLIC_UNAVAILABLE }, 503, args.headers);
	}

	const reader = upstream.getReader();
	const encoder = new TextEncoder();
	let firstTokenAt: number | undefined;
	let usage: ResponseUsage | undefined;
	let finalStatus = "streaming";
	let wroteText = false;
	let wroteTerminalNotice = false;

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			const decoder = new TextDecoder();
			let buffer = "";
			const enqueue = (text: string) => {
				if (!text) return;
				if (!firstTokenAt) firstTokenAt = Date.now();
				wroteText = true;
				controller.enqueue(encoder.encode(text));
			};
			const enqueueTerminalNotice = (notice: string) => {
				if (wroteTerminalNotice) return;
				wroteTerminalNotice = true;
				enqueue(notice);
			};

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split(/\r?\n/);
					buffer = lines.pop() ?? "";

					for (const line of lines) {
						if (!line.startsWith("data:")) continue;
						const payload = line.slice(5).trim();
						if (!payload || payload === "[DONE]") continue;
						const event = parseOpenAIStreamEvent(payload);
						if (!event) continue;
						if (event.type === "response.output_text.delta" && typeof event.delta === "string")
							enqueue(event.delta);
						if (event.type === "response.refusal.delta" && typeof event.delta === "string")
							enqueue(event.delta);
						if (event.type === "response.completed" && event.response) {
							usage = event.response.usage;
							finalStatus = event.response.status ?? "completed";
						}
						if (event.type === "response.incomplete") {
							usage = event.response?.usage ?? usage;
							finalStatus = "incomplete";
							enqueueTerminalNotice(STREAM_INCOMPLETE_NOTICE);
						}
						if (event.type === "response.failed" || event.type === "error")
							throw new Error("provider_stream_error");
					}
				}
				if (!wroteText) enqueue(EMPTY_RESPONSE);
				controller.close();
			} catch {
				const requestWasAborted = args.started.controller.signal.aborted;
				await reader.cancel().catch(() => undefined);
				if (!requestWasAborted) {
					args.started.controller.abort();
					if (wroteText) enqueueTerminalNotice(STREAM_FAILURE_NOTICE);
					else enqueue(PUBLIC_UNAVAILABLE);
				}
				controller.close();
				finalStatus = requestWasAborted ? "cancelled" : "failed";
			} finally {
				logPortfolioAgentTelemetry({
					requestId: args.requestId,
					model: args.started.model,
					fallbackFrom: args.started.fallbackFrom,
					durationMs: Date.now() - args.startedAt,
					timeToFirstTokenMs: firstTokenAt ? firstTokenAt - args.startedAt : undefined,
					retrievalMode: args.retrievalMode,
					retrievedChunkIds: args.retrievedChunkIds,
					status: finalStatus,
					usage
				});
			}
		},
		async cancel(reason) {
			args.started.controller.abort(reason);
			await reader.cancel(reason).catch(() => undefined);
		}
	});

	return new Response(stream, {
		status: 200,
		headers: {
			...args.headers,
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive"
		}
	});
}

export async function POST(req: NextRequest) {
	const requestId = randomUUID();
	const startedAt = Date.now();
	const rawBody = await req.text();
	if (rawBody.length > MAX_BODY_CHARS) return json({ error: "Message is too large." }, 413);

	let body: RequestBody;
	try {
		body = JSON.parse(rawBody) as RequestBody;
	} catch {
		return json({ error: "Invalid request body." }, 400);
	}

	const messages = sanitizeMessages(body.messages);
	const latest = latestUserContent(messages);
	if (!latest) return json({ error: "The final message must be a non-empty user message." }, 400);

	let rateLimit: PortfolioRateLimitResult;
	try {
		rateLimit = await consumePortfolioRateLimit(req);
	} catch (error) {
		console.error("[portfolio-agent] rate limiter unavailable", {
			requestId,
			reason: error instanceof PortfolioRateLimitUnavailableError ? error.message : "unknown"
		});
		return json({ error: PUBLIC_UNAVAILABLE }, 503, { "Retry-After": "5" });
	}
	const limitHeaders = portfolioRateLimitHeaders(rateLimit);
	if (!rateLimit.allowed) {
		return json(
			{
				error: "Message limit reached. Please wait briefly before trying again."
			},
			429,
			limitHeaders
		);
	}

	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) return json({ error: PUBLIC_UNAVAILABLE }, 503, limitHeaders);
	const currentPage = normalizeCurrentPage(body.currentPage);
	const riskFlags = detectPortfolioRiskFlags(latest);

	try {
		const retrieval = await retrievePortfolioContextHybrid(latest, messages, {
			apiKey
		});
		const context = capContext(formatRetrievedContext(retrieval));
		const instructions = composePortfolioInstructions({
			currentPage,
			contextBlock: context,
			hasContext: retrieval.chunks.length > 0,
			policyReminder: buildPolicyReminder(riskFlags)
		});
		const started = await startOpenAI({
			instructions,
			messages,
			stream: body.stream === true,
			apiKey,
			safetyIdentifier: portfolioSafetyIdentifier(req),
			requestSignal: req.signal
		});
		const telemetry = {
			started,
			requestId,
			startedAt,
			retrievalMode: retrieval.debug.mode,
			retrievedChunkIds: retrieval.chunks.map(chunk => chunk.id)
		};

		if (body.stream === true) return createStreamingReply({ ...telemetry, headers: limitHeaders });
		const reply = await createNonStreamingReply(telemetry);
		return json({ reply }, 200, limitHeaders);
	} catch (error) {
		console.error("[portfolio-agent] request failed", {
			requestId,
			error: error instanceof Error ? error.name : "unknown",
			providerStatus: error instanceof OpenAIStartError ? error.status : undefined
		});
		return json({ error: PUBLIC_UNAVAILABLE }, 503, limitHeaders);
	}
}
