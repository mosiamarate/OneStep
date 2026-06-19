"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthInput from "./AuthInput";
import Button from "../ui/Button";

import {
  confirmNewPassword,
  getAuthErrorMessage,
  verifyResetCode,
} from "../../lib/auth";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [checkingCode, setCheckingCode] = useState(true);
  const [validCode, setValidCode] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkResetCode = async () => {
      setError("");
      setSuccess("");

      if (!oobCode) {
        setError("This reset link is missing a reset code.");
        setCheckingCode(false);
        setValidCode(false);
        return;
      }

      try {
        setCheckingCode(true);

        const resetEmail = await verifyResetCode(oobCode);

        setEmail(resetEmail);
        setValidCode(true);
      } catch (error) {
        console.error("Invalid reset link:", error);
        setError(
          "This reset link is invalid or has expired. Please request a new password reset link."
        );
        setValidCode(false);
      } finally {
        setCheckingCode(false);
      }
    };

    checkResetCode();
  }, [oobCode]);

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!oobCode) {
      setError("This reset link is missing a reset code.");
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

      await confirmNewPassword(oobCode, password);

      setSuccess("Your password has been updated. You can now log in.");

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1800);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(getAuthErrorMessage(error));
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
            subtitle="Choose a new password for your OneStep account."
          />

          {checkingCode && (
            <div
              className="
                mb-5 rounded-xl border border-slate-700
                bg-slate-950/50 px-4 py-3 text-sm text-slate-400
              "
            >
              Checking your reset link...
            </div>
          )}

          {email && validCode && (
            <div
              className="
                mb-5 rounded-xl border border-blue-500/20
                bg-blue-500/10 px-4 py-3 text-sm text-blue-300
              "
            >
              Resetting password for:{" "}
              <span className="font-medium">{email}</span>
            </div>
          )}

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

          {validCode && !checkingCode && !success && (
            <form onSubmit={handleResetPassword} className="space-y-4">
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
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
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