export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  timestamps: number[];
}

export function evaluateRateLimit(
  timestamps: unknown,
  maxRequests: number,
  windowMs: number,
  now: number
): RateLimitDecision {
  const windowStart = now - windowMs;
  const validTimestamps = (Array.isArray(timestamps) ? timestamps : [])
    .filter(
      (timestamp): timestamp is number =>
        typeof timestamp === "number" &&
        Number.isFinite(timestamp) &&
        timestamp > windowStart
    )
    .sort((left, right) => left - right);

  if (validTimestamps.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((validTimestamps[0] + windowMs - now) / 1000)
      ),
      timestamps: validTimestamps,
    };
  }

  validTimestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSeconds: 0,
    timestamps: validTimestamps,
  };
}
