"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthInput from "./AuthInput";
import Button from "../ui/Button";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          newPassword: password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to reset password.");
      }

      setSuccess("Your password has been updated. You can now log in.");

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1800);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        flex items-center justify-center px-4 py-10
      "
    >
      <div className="pointer-events-none absolute -top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <AuthCard>
          <AuthHeader
            title="Create New Password"
            subtitle="Enter the reset code from your email and choose a new password."
          />

          {error && (
            <div
              className="
                mb-5 rounded-xl border border-red-500/20
                bg-red-500/10 px-4 py-3 text-sm text-red-400
              "
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="
                mb-5 rounded-xl border border-emerald-500/20
                bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400
              "
            >
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />

              <AuthInput
                label="Reset Code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={loading}
                required
              />

              <AuthInput
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                disabled={loading}
                required
              />

              <AuthInput
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                disabled={loading}
                required
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </AuthCard>
      </div>
    </main>
  );
}
