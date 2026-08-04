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

async function assertOtpCooldown(uid: string, purpose: OtpPurpose) {
  const otpSnap = await adminDb
    .collection("emailOtps")
    .doc(getOtpDocId(uid, purpose))
    .get();

  const createdAt = otpSnap.data()?.createdAt as Timestamp | undefined;

  if (
    createdAt &&
    Date.now() - createdAt.toMillis() < RESEND_COOLDOWN_SECONDS * 1000
  ) {
    throw new Error("Please wait before requesting another code.");
  }
}

export async function sendOtpEmail({
  email,
  name,
  purpose,
  uid,
}: SendOtpEmailOptions) {
  assertEmailConfig();
  await assertOtpCooldown(uid, purpose);

  const otp = generateOtp();

  await adminDb.collection("emailOtps").doc(getOtpDocId(uid, purpose)).set({
    uid,
    email: email.toLowerCase(),
    otpHash: hashOtp(uid, otp, purpose),
    purpose,
    attempts: 0,
    expiresAt: getOtpExpiry(),
    createdAt: FieldValue.serverTimestamp(),
    used: false,
  });

  if (purpose === OTP_PURPOSES.EMAIL_VERIFICATION) {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: "Verify your OneStep account",
      react: VerifyEmail({ name, otp }),
    });
    return;
  }

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your OneStep password",
    react: PasswordReset({ name, otp }),
  });
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
