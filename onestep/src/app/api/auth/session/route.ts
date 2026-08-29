import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  createRateLimitResponse,
  RATE_LIMIT_PRESETS,
} from "../../../../lib/rateLimit";
import { createAuthSession, clearAuthSession } from "../../../../lib/authSession";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    ...RATE_LIMIT_PRESETS.AUTH,
    scope: "session-create",
  });
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing authentication token." }, { status: 401 });
  }

  try {
    await createAuthSession(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to create a secure session." }, { status: 401 });
  }
}

export async function DELETE() {
  await clearAuthSession();
  return NextResponse.json({ ok: true });
}