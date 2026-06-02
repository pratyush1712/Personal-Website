export const AGENT_RATE_LIMIT = 20;
export const AGENT_RATE_WINDOW_MS = 60 * 60 * 1000;

const STORAGE_KEY = "portfolio-agent-rate-limit-v2";

type RateLimitStore = {
	windowStartedAt: number;
	count: number;
};

export type RateLimitSnapshot = {
	limit: number;
	remaining: number;
	resetAt: number;
	limited: boolean;
};

function now() {
	return Date.now();
}

function emptyStore(): RateLimitStore {
	return { windowStartedAt: now(), count: 0 };
}

function readStore(): RateLimitStore {
	if (typeof window === "undefined") return emptyStore();

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyStore();
		const parsed = JSON.parse(raw) as Partial<RateLimitStore>;
		if (typeof parsed.windowStartedAt !== "number" || typeof parsed.count !== "number") return emptyStore();
		return parsed as RateLimitStore;
	} catch {
		return emptyStore();
	}
}

function normalizeStore(store: RateLimitStore): RateLimitStore {
	return now() - store.windowStartedAt >= AGENT_RATE_WINDOW_MS ? emptyStore() : store;
}

function writeStore(store: RateLimitStore) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function snapshotFromStore(store: RateLimitStore): RateLimitSnapshot {
	const normalized = normalizeStore(store);
	const remaining = Math.max(0, AGENT_RATE_LIMIT - normalized.count);

	return {
		limit: AGENT_RATE_LIMIT,
		remaining,
		resetAt: normalized.windowStartedAt + AGENT_RATE_WINDOW_MS,
		limited: remaining === 0
	};
}

export function getAgentRateLimitSnapshot(): RateLimitSnapshot {
	const normalized = normalizeStore(readStore());
	writeStore(normalized);
	return snapshotFromStore(normalized);
}

export function consumeAgentRateLimit(): RateLimitSnapshot {
	const normalized = normalizeStore(readStore());
	const current = snapshotFromStore(normalized);
	if (current.limited) return current;

	const next = { ...normalized, count: normalized.count + 1 };
	writeStore(next);
	return snapshotFromStore(next);
}

export function formatResetDistance(resetAt: number): string {
	const ms = Math.max(0, resetAt - now());
	const minutes = Math.ceil(ms / 60000);
	if (minutes <= 1) return "about 1 minute";
	if (minutes < 60) return `${minutes} minutes`;
	return "about 1 hour";
}
