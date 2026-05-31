import { NextRequest } from "next/server";
import { buildPortfolioContext } from "@/utils/portfolioContext";

export const runtime = "nodejs"; // buildPortfolioContext reads from disk
export const dynamic = "force-dynamic"; // never cache the agent endpoint

const MAX_BODY_BYTES = 32 * 1024;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 2000;
const MAX_REPLY_CHARS = 4000;
const MAX_OUTPUT_TOKENS = 512;
const RATE_LIMIT = 10; // requests per window, per IP
const RATE_WINDOW_MS = 60_000;

const SYSTEM_PROMPT = `You are Portfolio Agent, a helpful assistant embedded in Pratyush Sudhakar's personal website.

Your job is to answer visitor questions about Pratyush using only the provided portfolio context.

Rules:
- Use only the portfolio context provided to you.
- Do not invent experience, projects, dates, awards, skills, metrics, links, or contact details.
- If the answer is not available in the context, say that you do not see that information in the portfolio context.
- Be concise, clear, and helpful.
- Write in third person unless the user specifically asks for first person wording.
- Help recruiters, collaborators, and visitors understand Pratyush's background.
- When useful, guide visitors toward relevant sections such as Projects, Experience, Resume, GitHub, LinkedIn, or Contact.
- Do not claim to be Pratyush.`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

// Best-effort, in-memory, per-IP fixed-window limiter. It resets on cold start and is
// per-instance (not shared across serverless instances), so it slows casual abuse but is not a
// hard guarantee. TODO: back this with a durable store (e.g. a Marketplace KV) if needed.
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();

	// Prevent memory leak by pruning expired entries when the map grows
	if (hits.size > 1000) {
		for (const [key, value] of hits.entries()) {
			if (now > value.resetAt) {
				hits.delete(key);
			}
		}
	}

	const record = hits.get(ip);
	if (!record || now > record.resetAt) {
		hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
		return false;
	}
	record.count += 1;
	return record.count > RATE_LIMIT;
}

function clientIp(req: NextRequest): string {
	const forwarded = req.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	return req.headers.get("x-real-ip") || "unknown";
}

function json(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: NextRequest): Promise<Response> {
	// 1. Reject oversized bodies early (header, then actual length).
	const declaredLength = Number(req.headers.get("content-length") || 0);
	if (Number.isNaN(declaredLength) || declaredLength > MAX_BODY_BYTES) {
		return json({ error: "Request too large or invalid content length.", code: "too_large" }, 413);
	}

	// 2. Soft per-IP rate limit.
	if (isRateLimited(clientIp(req))) {
		return json({ error: "Too many requests. Please slow down.", code: "rate_limited" }, 429);
	}

	// 3. Read + parse the body defensively.
	let raw: string;
	try {
		raw = await req.text();
	} catch {
		return json({ error: "Could not read request body.", code: "bad_request" }, 400);
	}
	if (raw.length > MAX_BODY_BYTES) return json({ error: "Request too large.", code: "too_large" }, 413);

	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return json({ error: "Invalid JSON.", code: "bad_request" }, 400);
	}

	// 4. Validate the messages array.
	const body = (parsed ?? {}) as { messages?: unknown; currentPage?: unknown };
	if (!Array.isArray(body.messages) || body.messages.length === 0) {
		return json({ error: "`messages` must be a non-empty array.", code: "bad_request" }, 400);
	}

	const messages: IncomingMessage[] = [];
	for (const item of body.messages.slice(-MAX_MESSAGES)) {
		const m = item as { role?: unknown; content?: unknown };
		if (m.role !== "user" && m.role !== "assistant") {
			return json({ error: "Each message needs role 'user' or 'assistant'.", code: "bad_request" }, 400);
		}
		if (typeof m.content !== "string" || !m.content.trim()) {
			return json({ error: "Message content must be a non-empty string.", code: "bad_request" }, 400);
		}
		if (m.content.length > MAX_MESSAGE_CHARS) {
			return json({ error: `Message exceeds ${MAX_MESSAGE_CHARS} characters.`, code: "bad_request" }, 400);
		}
		messages.push({ role: m.role, content: m.content });
	}

	// 5. Fail closed when unconfigured — never crash, never leak which key is missing.
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) return json({ error: "Portfolio Agent is not configured.", code: "not_configured" }, 503);

	const currentPage = typeof body.currentPage === "string" ? body.currentPage.slice(0, 120) : undefined;

	let context = "";
	try {
		context = buildPortfolioContext();
	} catch {
		context = "";
	}

	const systemContent = [
		SYSTEM_PROMPT,
		"",
		"PORTFOLIO CONTEXT:",
		context,
		currentPage ? `\nThe visitor is currently viewing the "${currentPage}" section.` : ""
	].join("\n");

	// 6. Call the provider (plain fetch — no SDK dependency). Swappable in one place.
	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
			body: JSON.stringify({
				model: process.env.OPENAI_MODEL || "gpt-4o-mini",
				max_tokens: MAX_OUTPUT_TOKENS,
				temperature: 0.3,
				messages: [{ role: "system", content: systemContent }, ...messages]
			})
		});

		if (!response.ok) {
			// Log the provider detail server-side only; return a generic message to the client.
			console.error("portfolio-agent: provider error", response.status, await response.text().catch(() => ""));
			return json({ error: "The agent is temporarily unavailable.", code: "server_error" }, 502);
		}

		const data = (await response.json()) as { choices?: { message?: { content?: unknown } }[] };
		const reply = data.choices?.[0]?.message?.content;
		if (typeof reply !== "string" || !reply.trim()) {
			return json({ error: "The agent returned an empty response.", code: "server_error" }, 502);
		}

		// No persistence: the reply is returned and forgotten server-side.
		return json({ reply: reply.slice(0, MAX_REPLY_CHARS) }, 200);
	} catch (error) {
		console.error("portfolio-agent: request failed", error);
		return json({ error: "The agent is temporarily unavailable.", code: "server_error" }, 500);
	}
}
