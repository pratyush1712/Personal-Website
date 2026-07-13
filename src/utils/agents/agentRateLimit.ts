export type RateLimitSnapshot = {
  limit: number;
  remaining: number;
  resetAt: number;
  limited: boolean;
};

function integerHeader(
  headers: Headers,
  primary: string,
  fallback?: string,
): number | undefined {
  const raw = headers.get(primary) ?? (fallback ? headers.get(fallback) : null);
  if (!raw) return undefined;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

/** Parse the server-authoritative rate-limit state. No client-side quota is enforced or persisted. */
export function rateLimitFromHeaders(
  headers: Headers,
  status?: number,
): RateLimitSnapshot | null {
  const limit = integerHeader(headers, "RateLimit-Limit", "X-RateLimit-Limit");
  const remaining = integerHeader(
    headers,
    "RateLimit-Remaining",
    "X-RateLimit-Remaining",
  );
  if (limit === undefined || remaining === undefined) return null;

  const retryAfter = integerHeader(headers, "Retry-After");
  const relativeReset = integerHeader(headers, "RateLimit-Reset");
  const legacyAbsoluteReset = integerHeader(headers, "X-RateLimit-Reset");
  const resetAt = retryAfter
    ? Date.now() + retryAfter * 1000
    : relativeReset !== undefined
      ? Date.now() + relativeReset * 1000
      : (legacyAbsoluteReset ?? Date.now());

  return {
    limit,
    remaining,
    resetAt,
    limited: status === 429 || remaining === 0,
  };
}

export function formatResetDistance(resetAt: number): string {
  const minutes = Math.ceil(Math.max(0, resetAt - Date.now()) / 60_000);
  if (minutes <= 1) return "about 1 minute";
  if (minutes < 60) return `${minutes} minutes`;
  return "about 1 hour";
}
