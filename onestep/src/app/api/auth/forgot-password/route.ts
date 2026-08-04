import { NextRequest, NextResponse } from "next/server";

import { getDisplayName, sendOtpEmail } from "../../../../lib/authEmail";
import { adminAuth } from "../../../../lib/firebase-admin";
import { OTP_PURPOSES } from "../../../../lib/otp";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const user = await adminAuth.getUserByEmail(normalizedEmail);

    await sendOtpEmail({
      uid: user.uid,
      email: normalizedEmail,
      name: getDisplayName(user.displayName, normalizedEmail),
      purpose: OTP_PURPOSES.PASSWORD_RESET,
    });
  } catch (error) {
    console.error("Password reset request failed:", error);
  }

  return NextResponse.json({ ok: true });
}
