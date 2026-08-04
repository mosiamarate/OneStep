import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import {
  getDisplayName,
  getPublicOtpError,
  sendWelcomeEmail,
} from "../../../../lib/authEmail";
import { adminAuth, adminDb } from "../../../../lib/firebase-admin";
import {
  getOtpDocId,
  isOtpExpired,
  isOtpMatch,
  MAX_OTP_ATTEMPTS,
  OTP_PURPOSES,
} from "../../../../lib/otp";

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

    const { otp } = (await request.json()) as { otp?: string };

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your email." },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);
    const purpose = OTP_PURPOSES.EMAIL_VERIFICATION;
    const otpRef = adminDb
      .collection("emailOtps")
      .doc(getOtpDocId(user.uid, purpose));
    const otpSnap = await otpRef.get();

    if (!otpSnap.exists) {
      return NextResponse.json(
        { error: "Request a new verification code." },
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

    await adminAuth.updateUser(user.uid, { emailVerified: true });
    await adminDb.collection("users").doc(user.uid).set(
      {
        emailOtpVerified: true,
        emailVerified: true,
        emailOtpVerifiedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await otpRef.delete();

    if (user.email) {
      await sendWelcomeEmail(
        user.email,
        getDisplayName(user.displayName, user.email)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicOtpError(error) },
      { status: 400 }
    );
  }
}
