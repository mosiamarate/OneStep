"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "../../../components/auth/AuthCard";
import AuthHeader from "../../../components/auth/AuthHeader";
import AuthInput from "../../../components/auth/AuthInput";
import AuthFooter from "../../../components/auth/AuthFooter";
import GoogleButton from "../../../components/auth/GoogleButton";
import Button from "../../../components/ui/Button";

import {
  getAuthErrorMessage,
  loginUser,
  loginWithGoogle,
} from "../../../lib/auth";

import Footer from "../../../components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(
    null
  );

  const validateForm = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    return true;
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) return;

    try {
      setLoading("email");

      await loginUser(email.trim(), password);

      router.replace("/dashboard");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading("google");

      await loginWithGoogle();

      router.replace("/dashboard");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(null);
    }
  };

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-b
        from-slate-950
        via-slate-900
        to-slate-950
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div className="pointer-events-none absolute -top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <AuthCard>
          <AuthHeader
            title="OneStep"
            subtitle="A calm space for overwhelmed minds."
          />

          {error && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-400
              "
            >
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={loading !== null}
              required
            />

            <div className="space-y-2">
              <AuthInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={loading !== null}
                required
              />

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="
                    text-sm
                    text-slate-400
                    hover:text-blue-400
                    transition-colors
                  "
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" disabled={loading !== null}>
              {loading === "email" ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Or
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <GoogleButton
            onClick={handleGoogleLogin}
            loading={loading === "google"}
          />

          <AuthFooter
            text="Don't have an account?"
            linkText="Create Account"
            href="/auth/signup"
          />
        </AuthCard>
        <Footer />
      </div>
    </main>
  );
}