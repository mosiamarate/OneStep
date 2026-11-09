import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import PasswordReset from "../emails/PasswordReset";
import VerifyEmail from "../emails/VerifyEmail";
import WelcomeEmail from "../emails/WelcomeEmail";
import { adminDb } from "./firebase-admin";
import { emailFrom, resend } from "./resend";
import {
  getOtpDocId,
  getOtpExpiry,
  hashOtp,
  OTP_PURPOSES,
  OtpPurpose,
  generateOtp,
} from "./otp";

const RESEND_COOLDOWN_SECONDS = 60;

interface SendOtpEmailOptions {
  email: string;
  name: string;
  purpose: Extract<
    OtpPurpose,
    "EMAIL_VERIFICATION" | "PASSWORD_RESET"
  >;
  uid: string;
}

function assertEmailConfig() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://onestepapp.co.za";
}

async function createOtpRecord(
  uid: string,
  email: string,
  purpose: OtpPurpose
) {
  const otpRef = adminDb
    .collection("emailOtps")
    .doc(getOtpDocId(uid, purpose));
  const otp = generateOtp();
  const otpHash = hashOtp(uid, otp, purpose);

  await adminDb.runTransaction(async (transaction) => {
    const otpSnap = await transaction.get(otpRef);
    const createdAt = otpSnap.data()?.createdAt as Timestamp | undefined;

    if (
      createdAt &&
      Date.now() - createdAt.toMillis() < RESEND_COOLDOWN_SECONDS * 1000
    ) {
      throw new Error("Please wait before requesting another code.");
    }

    transaction.set(otpRef, {
      uid,
      email: email.toLowerCase(),
      otpHash,
      purpose,
      attempts: 0,
      expiresAt: getOtpExpiry(),
      createdAt: FieldValue.serverTimestamp(),
      used: false,
    });
  });

  return { otp, otpRef, otpHash };
}

export async function sendOtpEmail({
  email,
  name,
  purpose,
  uid,
}: SendOtpEmailOptions) {
  assertEmailConfig();
  const { otp, otpRef, otpHash } = await createOtpRecord(
    uid,
    email,
    purpose
  );

  try {
    const result =
      purpose === OTP_PURPOSES.EMAIL_VERIFICATION
        ? await resend.emails.send({
            from: emailFrom,
            to: email,
            subject: "Verify your OneStep account",
            react: VerifyEmail({ name, otp }),
          })
        : await resend.emails.send({
            from: emailFrom,
            to: email,
            subject: "Reset your OneStep password",
            react: PasswordReset({ name, otp }),
          });

    if (result.error) {
      throw new Error("Unable to deliver the code. Please try again.");
    }

  } catch (error) {
    await adminDb.runTransaction(async (transaction) => {
      const currentOtp = await transaction.get(otpRef);
      if (currentOtp.data()?.otpHash === otpHash) {
        transaction.delete(otpRef);
      }
    });
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  assertEmailConfig();

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Welcome to OneStep",
    react: WelcomeEmail({ name, appUrl: getAppUrl() }),
  });
}

export function getDisplayName(name?: string | null, email?: string | null) {
  if (name?.trim()) return name.trim();
  if (email?.includes("@")) return email.split("@")[0];
  return "there";
}

export function getPublicOtpError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to process this request.";
}

export function getVerificationPurpose() {
  return OTP_PURPOSES.EMAIL_VERIFICATION;
}

export function getPasswordResetPurpose() {
  return OTP_PURPOSES.PASSWORD_RESET;
}
