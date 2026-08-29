import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  identifierKey?: string;
  scope?: string;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      const validTimestamps = record.timestamps.filter(
        (ts) => now - ts < 15 * 60 * 1000
      );
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: validTimestamps });
      }
    }
  }, 5 * 60 * 1000);
}

function getClientIdentifier(request: NextRequest, customKey?: string): string {
  if (customKey) return customKey;

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  return ip;
}

export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const { maxRequests, windowMs, identifierKey, scope } = options;
  const key = `${scope || "global"}:${getClientIdentifier(request, identifierKey)}`;
  const now = Date.now();

  const record = rateLimitMap.get(key) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSeconds = Math.ceil(
      (oldestTimestamp + windowMs - now) / 1000
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

export function createRateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: `Too many requests. Please wait ${retryAfterSeconds} seconds before trying again.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

// Preset Rate Limit Configurations
export const RATE_LIMIT_PRESETS = {
  // General Auth (login/signup/verification): 10 requests per minute
  AUTH: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  // Sensitive Actions (password reset/account deletion/data export): 5 requests per 10 minutes
  STRICT: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  },
};
