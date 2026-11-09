import "server-only";

import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "./firebase-admin";
import { evaluateRateLimit } from "./rateLimitPolicy";

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  identifierKey?: string;
  scope?: string;
}

function getClientIdentifier(request: NextRequest, customKey?: string): string {
  if (customKey) return customKey;

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp && isIP(realIp) ? realIp : "unknown";
}

export async function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const { maxRequests, windowMs, identifierKey, scope } = options;
  const key = `${scope || "global"}_${encodeURIComponent(
    getClientIdentifier(request, identifierKey)
  )}`;
  const recordRef = adminDb.collection("apiRateLimits").doc(key);
  const now = Date.now();

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(recordRef);
    const decision = evaluateRateLimit(
      snapshot.data()?.timestamps,
      maxRequests,
      windowMs,
      now
    );
    if (!decision.allowed) return decision;

    transaction.set(recordRef, {
      timestamps: decision.timestamps,
      expiresAt: Timestamp.fromMillis(now + windowMs),
    });

    return {
      allowed: decision.allowed,
      remaining: decision.remaining,
      retryAfterSeconds: decision.retryAfterSeconds,
    };
  });
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
