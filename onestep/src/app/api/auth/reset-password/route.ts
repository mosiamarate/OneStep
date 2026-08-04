import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "../../../../lib/firebase-admin";
import {
  getOtpDocId,
  isOtpExpired,
  isOtpMatch,
  MAX_OTP_ATTEMPTS,
  OTP_PURPOSES,
} from "../../../../lib/otp";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const { email, newPassword, otp } = (await request.json()) as {
    email?: string;
    newPassword?: string;
    otp?: string;
  };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    return NextResponse.json(
      { error: "Enter the 6-digit code from your email." },
      { status: 400 }
    );
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters." },
      { status: 400 }
    );
  }

  try {
    const user = await adminAuth.getUserByEmail(normalizedEmail);
    const purpose = OTP_PURPOSES.PASSWORD_RESET;
    const otpRef = adminDb
      .collection("emailOtps")
      .doc(getOtpDocId(user.uid, purpose));
    const otpSnap = await otpRef.get();

    if (!otpSnap.exists) {
      return NextResponse.json(
        { error: "Request a new reset code." },
        { status: 400 }
      );
    }

    const otpData = otpSnap.data();
    const attempts = Number(otpData?.attempts || 0);
    const expiresAt = otpData?.expiresAt as Timestamp | undefined;
    const otpHash = otpData?.otpHash as string | undefined;
    const used = otpData?.used === true;

    if (used || isOtpExpired(expiresAt)) {
      await otpRef.delete();

      return NextResponse.json(
        { error: "This code has expired. Request a new one." },
        { status: 400 }
      );
    }

    if (attempts >= MAX_OTP_ATTEMPTS || !otpHash) {
      await otpRef.delete();

      return NextResponse.json(
        { error: "Too many attempts. Request a new code." },
        { status: 429 }
      );
    }

    if (!isOtpMatch(user.uid, otp, purpose, otpHash)) {
      await otpRef.update({
        attempts: FieldValue.increment(1),
        lastAttemptAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        { error: "That code is not correct." },
        { status: 400 }
      );
    }

    await adminAuth.updateUser(user.uid, { password: newPassword });
    await otpRef.delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset failed:", error);

    return NextResponse.json(
      { error: "Unable to reset password with that code." },
      { status: 400 }
    );
  }
}
