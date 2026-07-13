import { createHmac } from "crypto";

type RequestLike = { headers: { get(name: string): string | null } };
type Bucket = { count: number; startedAt: number };
type GlobalRateState = typeof globalThis & {
	__portfolioAgentRateBuckets?: Map<string, Bucket>;
	__portfolioAgentRateLimitWarned?: boolean;
};

const MINUTE_LIMIT = positiveInt(process.env.PORTFOLIO_AGENT_RATE_LIMIT_PER_MINUTE, 10);
const HOURLY_LIMIT = positiveInt(process.env.PORTFOLIO_AGENT_RATE_LIMIT_PER_HOUR, 100);
const REDIS_TIMEOUT_MS = positiveInt(process.env.PORTFOLIO_AGENT_RATE_LIMIT_TIMEOUT_MS, 2_000);
const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;

const globalState = globalThis as GlobalRateState;
const memoryBuckets = globalState.__portfolioAgentRateBuckets ?? new Map<string, Bucket>();
globalState.__portfolioAgentRateBuckets = memoryBuckets;

export type PortfolioRateLimitScope = "minute" | "hour";

export type PortfolioRateLimitResult = {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetAt: number;
	retryAfterSeconds?: number;
	backend: "redis" | "memory";
	scope: PortfolioRateLimitScope;
};

export class PortfolioRateLimitUnavailableError extends Error {
	constructor(reason: string) {
		super(reason);
		this.name = "PortfolioRateLimitUnavailableError";
	}
}

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clientAddress(req: RequestLike): string {
	return (
		req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		req.headers.get("x-real-ip")?.trim() ||
		"anonymous"
	);
}

export function portfolioSafetyIdentifier(req: RequestLike): string {
	const salt = process.env.PORTFOLIO_AGENT_IDENTIFIER_SALT || process.env.OPENAI_API_KEY || "portfolio-agent";
	return createHmac("sha256", salt).update(clientAddress(req)).digest("hex").slice(0, 32);
}

function currentMemoryBucket(key: string, windowMs: number): Bucket {
	const now = Date.now();
	const existing = memoryBuckets.get(key);
	if (!existing || now - existing.startedAt >= windowMs) {
		const fresh = { count: 0, startedAt: now };
		memoryBuckets.set(key, fresh);
		return fresh;
	}
	return existing;
}

function incrementMemoryBucket(key: string, windowMs: number): { count: number; resetAt: number } {
	const bucket = currentMemoryBucket(key, windowMs);
	bucket.count += 1;
	return { count: bucket.count, resetAt: bucket.startedAt + windowMs };
}

function toResult(args: {
	minuteCount: number;
	hourCount: number;
	minuteResetAt: number;
	hourResetAt: number;
	backend: "redis" | "memory";
}): PortfolioRateLimitResult {
	const minuteExceeded = args.minuteCount > MINUTE_LIMIT;
	const hourExceeded = args.hourCount > HOURLY_LIMIT;
	if (minuteExceeded || hourExceeded) {
		const scope: PortfolioRateLimitScope = minuteExceeded ? "minute" : "hour";
		const resetAt = minuteExceeded ? args.minuteResetAt : args.hourResetAt;
		return {
			allowed: false,
			limit: minuteExceeded ? MINUTE_LIMIT : HOURLY_LIMIT,
			remaining: 0,
			resetAt,
			retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
			backend: args.backend,
			scope
		};
	}

	return {
		allowed: true,
		limit: HOURLY_LIMIT,
		remaining: Math.max(0, HOURLY_LIMIT - args.hourCount),
		resetAt: args.hourResetAt,
		backend: args.backend,
		scope: "hour"
	};
}

function consumeMemory(identifier: string): PortfolioRateLimitResult {
	const minuteKey = `${identifier}:minute`;
	const hourKey = `${identifier}:hour`;
	const hourBefore = currentMemoryBucket(hourKey, HOUR_MS);
	const hourResetAt = hourBefore.startedAt + HOUR_MS;

	if (hourBefore.count >= HOURLY_LIMIT) {
		return toResult({
			minuteCount: 0,
			hourCount: hourBefore.count + 1,
			minuteResetAt: Date.now() + MINUTE_MS,
			hourResetAt,
			backend: "memory"
		});
	}

	const minute = incrementMemoryBucket(minuteKey, MINUTE_MS);
	if (minute.count > MINUTE_LIMIT) {
		return toResult({
			minuteCount: minute.count,
			hourCount: hourBefore.count,
			minuteResetAt: minute.resetAt,
			hourResetAt,
			backend: "memory"
		});
	}

	const hour = incrementMemoryBucket(hourKey, HOUR_MS);
	return toResult({
		minuteCount: minute.count,
		hourCount: hour.count,
		minuteResetAt: minute.resetAt,
		hourResetAt: hour.resetAt,
		backend: "memory"
	});
}

async function consumeRedis(identifier: string, url: string, token: string): Promise<PortfolioRateLimitResult> {
	const script = `
local hour = tonumber(redis.call('GET', KEYS[2]) or '0')
local hourTtl = redis.call('PTTL', KEYS[2])
if hour >= tonumber(ARGV[4]) then
  return {0, hour + 1, 0, hourTtl}
end
local minute = redis.call('INCR', KEYS[1])
if minute == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local minuteTtl = redis.call('PTTL', KEYS[1])
if minute > tonumber(ARGV[3]) then
  return {minute, hour, minuteTtl, hourTtl}
end
hour = redis.call('INCR', KEYS[2])
if hour == 1 then redis.call('PEXPIRE', KEYS[2], ARGV[2]) end
hourTtl = redis.call('PTTL', KEYS[2])
return {minute, hour, minuteTtl, hourTtl}`;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify([
				"EVAL",
				script,
				"2",
				`portfolio-agent:${identifier}:minute`,
				`portfolio-agent:${identifier}:hour`,
				String(MINUTE_MS),
				String(HOUR_MS),
				String(MINUTE_LIMIT),
				String(HOURLY_LIMIT)
			]),
			signal: controller.signal
		});
		if (!response.ok) throw new PortfolioRateLimitUnavailableError(`redis_http_${response.status}`);
		const data = (await response.json()) as { result?: unknown };
		if (!Array.isArray(data.result) || data.result.length < 4)
			throw new PortfolioRateLimitUnavailableError("redis_invalid_response");
		const [minuteCount, hourCount, minuteTtl, hourTtl] = data.result.map(Number);
		if (![minuteCount, hourCount, minuteTtl, hourTtl].every(Number.isFinite))
			throw new PortfolioRateLimitUnavailableError("redis_invalid_counters");
		const now = Date.now();
		return toResult({
			minuteCount,
			hourCount,
			minuteResetAt: now + Math.max(0, minuteTtl),
			hourResetAt: now + Math.max(0, hourTtl),
			backend: "redis"
		});
	} catch (error) {
		if (error instanceof PortfolioRateLimitUnavailableError) throw error;
		throw new PortfolioRateLimitUnavailableError(controller.signal.aborted ? "redis_timeout" : "redis_unreachable");
	} finally {
		clearTimeout(timeout);
	}
}

function warnMemoryFallback(): void {
	if (globalState.__portfolioAgentRateLimitWarned) return;
	globalState.__portfolioAgentRateLimitWarned = true;
	console.warn("[portfolio-agent] Distributed rate limiting is not configured; using process-local memory buckets.");
}

export async function consumePortfolioRateLimit(req: RequestLike): Promise<PortfolioRateLimitResult> {
	const identifier = portfolioSafetyIdentifier(req);
	const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

	if (Boolean(url) !== Boolean(token)) throw new PortfolioRateLimitUnavailableError("redis_misconfigured");
	if (url && token) return consumeRedis(identifier, url, token);

	warnMemoryFallback();
	return consumeMemory(identifier);
}

export function portfolioRateLimitHeaders(result: PortfolioRateLimitResult): Record<string, string> {
	const resetSeconds = Math.max(0, Math.ceil((result.resetAt - Date.now()) / 1000));
	return {
		"RateLimit-Limit": String(result.limit),
		"RateLimit-Remaining": String(result.remaining),
		"RateLimit-Reset": String(resetSeconds),
		"X-RateLimit-Limit": String(result.limit),
		"X-RateLimit-Remaining": String(result.remaining),
		"X-RateLimit-Reset": String(result.resetAt),
		"X-RateLimit-Scope": result.scope,
		"X-RateLimit-Backend": result.backend,
		...(result.retryAfterSeconds ? { "Retry-After": String(result.retryAfterSeconds) } : {}),
		"Cache-Control": "no-store"
	};
}

export function __resetPortfolioRateLimitMemoryForTests(): void {
	memoryBuckets.clear();
}

export function __expirePortfolioRateLimitMinuteWindowForTests(req: RequestLike): void {
	memoryBuckets.delete(`${portfolioSafetyIdentifier(req)}:minute`);
}
