"use client";

import type { FormEvent } from "react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthCard from "../../../components/auth/AuthCard";
import AuthHeader from "../../../components/auth/AuthHeader";
import AuthInput from "../../../components/auth/AuthInput";
import Button from "../../../components/ui/Button";
import Footer from "../../../components/layout/Footer";
import { useAuth } from "../../../hooks/useAuth";
import { setAuthCookie } from "../../../lib/authCookie";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const redirectTo = searchParams.get("redirectTo");
  const safeRedirectTo =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(
    "Check your inbox for your verification code."
  );
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const callOtpApi = async (path: string, body?: Record<string, string>) => {
    if (!user) throw new Error("You need to sign in again.");

    const token = await user.getIdToken();
    const response = await fetch(path, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    return data;
  };

  const sendOtp = async () => {
    setError("");
    setMessage("");
    setSending(true);

    try {
      await callOtpApi("/api/auth/resend-verification");
      setMessage("A verification code has been sent to your email.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to send code.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setVerifying(true);

    try {
      await callOtpApi("/api/auth/verify-email", { otp });
      setAuthCookie(true, true);
      router.replace(safeRedirectTo);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to verify code."
      );
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    );
  }

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        from-slate-950 via-slate-900 to-slate-950
        flex items-center justify-center px-4 py-10
      "
    >
      <div className="pointer-events-none absolute -top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <AuthCard>
          <AuthHeader
            title="Verify your email"
            subtitle={`Enter the code sent to ${user.email || "your email"}.`}
          />

          {message && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={verifyOtp} className="space-y-4">
            <AuthInput
              label="Verification code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={verifying}
              required
            />

            <Button type="submit" disabled={otp.length !== 6 || verifying}>
              {verifying ? "Verifying..." : "Verify email"}
            </Button>
          </form>

          <button
            type="button"
            onClick={sendOtp}
            disabled={sending || verifying}
            className="mt-5 w-full text-sm text-slate-400 transition-colors hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending code..." : "Send a new code"}
          </button>
        </AuthCard>
        <Footer />
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
