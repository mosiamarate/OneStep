import { NextRequest, NextResponse } from "next/server";

import { getDisplayName, getPublicOtpError, sendOtpEmail } from "../../../../lib/authEmail";
import { adminAuth } from "../../../../lib/firebase-admin";
import { OTP_PURPOSES } from "../../../../lib/otp";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  return authHeader.slice("Bearer ".length);
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token." }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);

    if (!user.email) {
      return NextResponse.json(
        { error: "Your account does not have an email address." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    await sendOtpEmail({
      uid: user.uid,
      email: user.email,
      name: getDisplayName(user.displayName, user.email),
      purpose: OTP_PURPOSES.EMAIL_VERIFICATION,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicOtpError(error) },
      { status: 400 }
    );
  }
}
