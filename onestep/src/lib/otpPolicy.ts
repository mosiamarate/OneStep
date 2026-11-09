export function requireOtpSecret(secret: string | undefined) {
  if (!secret || secret.length < 32) {
    throw new Error("OTP_SECRET must be configured with at least 32 characters.");
  }

  return secret;
}
