import { createHmac } from "crypto";

type RequestLike = { headers: { get(name: string): string | null } };
type Bucket = { count: number; startedAt: number };
type GlobalRateState = typeof globalThis & {
  __portfolioAgentRateBuckets?: Map<string, Bucket>;
};

const MINUTE_LIMIT = positiveInt(
  process.env.PORTFOLIO_AGENT_RATE_LIMIT_PER_MINUTE,
  10,
);
const HOURLY_LIMIT = positiveInt(
  process.env.PORTFOLIO_AGENT_RATE_LIMIT_PER_HOUR,
  100,
);
const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;

const globalState = globalThis as GlobalRateState;
const memoryBuckets =
  globalState.__portfolioAgentRateBuckets ?? new Map<string, Bucket>();
globalState.__portfolioAgentRateBuckets = memoryBuckets;

export type PortfolioRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
  backend: "redis" | "memory";
};

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
  const salt =
    process.env.PORTFOLIO_AGENT_IDENTIFIER_SALT ||
    process.env.OPENAI_API_KEY ||
    "portfolio-agent";
  return createHmac("sha256", salt)
    .update(clientAddress(req))
    .digest("hex")
    .slice(0, 32);
}

function consumeMemoryBucket(
  key: string,
  windowMs: number,
): { count: number; resetAt: number } {
  const now = Date.now();
  const existing = memoryBuckets.get(key);
  const bucket =
    !existing || now - existing.startedAt >= windowMs
      ? { count: 0, startedAt: now }
      : existing;
  bucket.count += 1;
  memoryBuckets.set(key, bucket);
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
    const resetAt = minuteExceeded ? args.minuteResetAt : args.hourResetAt;
    return {
      allowed: false,
      limit: minuteExceeded ? MINUTE_LIMIT : HOURLY_LIMIT,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
      backend: args.backend,
    };
  }

  return {
    allowed: true,
    limit: HOURLY_LIMIT,
    remaining: Math.max(0, HOURLY_LIMIT - args.hourCount),
    resetAt: args.hourResetAt,
    backend: args.backend,
  };
}

function consumeMemory(identifier: string): PortfolioRateLimitResult {
  const minute = consumeMemoryBucket(`${identifier}:minute`, MINUTE_MS);
  const hour = consumeMemoryBucket(`${identifier}:hour`, HOUR_MS);
  return toResult({
    minuteCount: minute.count,
    hourCount: hour.count,
    minuteResetAt: minute.resetAt,
    hourResetAt: hour.resetAt,
    backend: "memory",
  });
}

async function consumeRedis(
  identifier: string,
): Promise<PortfolioRateLimitResult | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const script = `
local minute = redis.call('INCR', KEYS[1])
if minute == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local hour = redis.call('INCR', KEYS[2])
if hour == 1 then redis.call('PEXPIRE', KEYS[2], ARGV[2]) end
local minuteTtl = redis.call('PTTL', KEYS[1])
local hourTtl = redis.call('PTTL', KEYS[2])
return {minute, hour, minuteTtl, hourTtl}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        script,
        "2",
        `portfolio-agent:${identifier}:minute`,
        `portfolio-agent:${identifier}:hour`,
        String(MINUTE_MS),
        String(HOUR_MS),
      ]),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { result?: unknown };
    if (!Array.isArray(data.result) || data.result.length < 4) return null;
    const [minuteCount, hourCount, minuteTtl, hourTtl] =
      data.result.map(Number);
    if (![minuteCount, hourCount, minuteTtl, hourTtl].every(Number.isFinite))
      return null;
    const now = Date.now();
    return toResult({
      minuteCount,
      hourCount,
      minuteResetAt: now + Math.max(0, minuteTtl),
      hourResetAt: now + Math.max(0, hourTtl),
      backend: "redis",
    });
  } catch {
    return null;
  }
}

export async function consumePortfolioRateLimit(
  req: RequestLike,
): Promise<PortfolioRateLimitResult> {
  const identifier = portfolioSafetyIdentifier(req);
  return (await consumeRedis(identifier)) ?? consumeMemory(identifier);
}

export function portfolioRateLimitHeaders(
  result: PortfolioRateLimitResult,
): Record<string, string> {
  const resetSeconds = Math.max(
    0,
    Math.ceil((result.resetAt - Date.now()) / 1000),
  );
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(resetSeconds),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt),
    ...(result.retryAfterSeconds
      ? { "Retry-After": String(result.retryAfterSeconds) }
      : {}),
    "Cache-Control": "no-store",
  };
}
