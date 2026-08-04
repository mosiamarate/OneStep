import { createHash, randomInt, timingSafeEqual } from "crypto";
import { Timestamp } from "firebase-admin/firestore";

const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;

export const OTP_PURPOSES = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
  LOGIN_VERIFICATION: "LOGIN_VERIFICATION",
  CHANGE_EMAIL: "CHANGE_EMAIL",
} as const;

export type OtpPurpose = (typeof OTP_PURPOSES)[keyof typeof OTP_PURPOSES];

function getOtpSecret() {
  return (
    process.env.OTP_SECRET ||
    process.env.FIREBASE_PRIVATE_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "onestep"
  );
}

export function generateOtp() {
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export function hashOtp(uid: string, otp: string, purpose: OtpPurpose) {
  return createHash("sha256")
    .update(`${uid}:${purpose}:${otp}:${getOtpSecret()}`)
    .digest("hex");
}

export function isOtpMatch(
  uid: string,
  otp: string,
  purpose: OtpPurpose,
  expectedHash: string
) {
  const otpHash = hashOtp(uid, otp, purpose);

  return timingSafeEqual(Buffer.from(otpHash), Buffer.from(expectedHash));
}

export function getOtpDocId(uid: string, purpose: OtpPurpose) {
  return `${purpose}_${uid}`;
}

export function getOtpExpiry() {
  return Timestamp.fromDate(
    new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  );
}

export function isOtpExpired(expiresAt?: Timestamp) {
  return !expiresAt || expiresAt.toMillis() < Date.now();
}
