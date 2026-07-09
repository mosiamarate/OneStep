"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";

import AuthCard from "../../../components/auth/AuthCard";
import AuthHeader from "../../../components/auth/AuthHeader";
import AuthInput from "../../../components/auth/AuthInput";
import Button from "../../../components/ui/Button";
import { getAuthErrorMessage, resetPassword } from "../../../lib/auth";

import Footer from "../../../components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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

    try {
      setLoading(true);

      await resetPassword(email.trim());

      setSuccess("Reset link sent. Please check your inbox.");
      setEmail("");
    } catch (error) {
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
            title="Reset Password"
            subtitle="Enter your email and we’ll send you a reset link."
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

            <Button type="submit" disabled={loading}>
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </AuthCard>
        <Footer />
      </div>
    </main>
  );
}