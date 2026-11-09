import { test, expect } from "@playwright/test";

import { evaluateRateLimit } from "../src/lib/rateLimitPolicy";
import { requireOtpSecret } from "../src/lib/otpPolicy";

test.describe("authentication security policies", () => {
  test("requires a dedicated OTP secret of at least 32 characters", () => {
    expect(() => requireOtpSecret(undefined)).toThrow(/OTP_SECRET/);
    expect(() => requireOtpSecret("short")).toThrow(/32 characters/);
    expect(requireOtpSecret("a".repeat(32))).toBe("a".repeat(32));
  });

  test("allows requests up to the configured limit", () => {
    const first = evaluateRateLimit([], 2, 60_000, 10_000);
    const second = evaluateRateLimit(first.timestamps, 2, 60_000, 11_000);

    expect(first).toMatchObject({ allowed: true, remaining: 1 });
    expect(second).toMatchObject({ allowed: true, remaining: 0 });
  });

  test("blocks requests over the limit and returns a retry delay", () => {
    const decision = evaluateRateLimit([10_000, 11_000], 2, 60_000, 12_000);

    expect(decision).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 58,
    });
  });

  test("drops expired and malformed timestamps before counting", () => {
    const decision = evaluateRateLimit(
      [-1, Number.NaN, "invalid", 59_000],
      2,
      60_000,
      60_000
    );

    expect(decision).toMatchObject({ allowed: true, remaining: 0 });
    expect(decision.timestamps).toEqual([59_000, 60_000]);
  });
});
