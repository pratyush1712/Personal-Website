type StreamCallbacks = {
	onChunk: (chunk: string) => void;
};

type JsonAgentResponse = {
	reply?: unknown;
	error?: unknown;
};

export async function readAgentResponse(response: Response, callbacks: StreamCallbacks): Promise<string> {
	const contentType = response.headers.get("content-type") ?? "";

	if (!response.ok) {
		throw new Error(await readErrorMessage(response));
	}

	if (!response.body || contentType.includes("application/json")) {
		const data = (await response.json()) as JsonAgentResponse;
		const reply = typeof data.reply === "string" ? data.reply.trim() : "";
		if (!reply) throw new Error("Portfolio Agent returned an empty response.");
		callbacks.onChunk(reply);
		return reply;
	}

	if (contentType.includes("text/event-stream")) {
		return readEventStream(response, callbacks);
	}

	return readTextStream(response, callbacks);
}

async function readTextStream(response: Response, { onChunk }: StreamCallbacks): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) throw new Error("Portfolio Agent did not return a readable response.");

	const decoder = new TextDecoder();
	let fullText = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value, { stream: true });
		if (!chunk) continue;
		fullText += chunk;
		onChunk(chunk);
	}

	const tail = decoder.decode();
	if (tail) {
		fullText += tail;
		onChunk(tail);
	}

	return fullText.trim();
}

async function readEventStream(response: Response, { onChunk }: StreamCallbacks): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) throw new Error("Portfolio Agent did not return a readable stream.");

	const decoder = new TextDecoder();
	let buffer = "";
	let fullText = "";

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

			const chunk = extractSseChunk(payload);
			if (!chunk) continue;
			fullText += chunk;
			onChunk(chunk);
		}
	}

	return fullText.trim();
}

function extractSseChunk(payload: string): string {
	try {
		const parsed = JSON.parse(payload) as { token?: unknown; content?: unknown; delta?: unknown };
		if (typeof parsed.token === "string") return parsed.token;
		if (typeof parsed.content === "string") return parsed.content;
		if (typeof parsed.delta === "string") return parsed.delta;
	} catch {
		return payload;
	}
	return "";
}

async function readErrorMessage(response: Response): Promise<string> {
	try {
		const contentType = response.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			const data = (await response.json()) as JsonAgentResponse;
			if (typeof data.error === "string" && data.error.trim()) return data.error.trim();
		}
		const text = await response.text();
		if (text.trim()) return text.trim();
	} catch {}

	if (response.status === 429) return "Hourly message limit reached. Please try again after the window resets.";
	return "Portfolio Agent is temporarily unavailable.";
}
