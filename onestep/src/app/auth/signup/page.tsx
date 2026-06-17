"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "../../../components/auth/AuthCard";
import AuthHeader from "../../../components/auth/AuthHeader";
import AuthInput from "../../../components/auth/AuthInput";
import AuthFooter from "../../../components/auth/AuthFooter";
import GoogleButton from "../../../components/auth/GoogleButton";
import Button from "../../../components/ui/Button";

import {
  getAuthErrorMessage,
  loginWithGoogle,
  signupUser,
} from "../../../lib/auth";

import Footer from "../../../components/layout/Footer";


export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading("email");

      await signupUser(fullName.trim(), email.trim(), password);

      router.replace("/dashboard");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSignup = async () => {
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
            title="Create Account"
            subtitle="Start gently. One step at a time."
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

          <form onSubmit={handleSignup} className="space-y-4">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              disabled={loading !== null}
              required
            />

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

            <AuthInput
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              disabled={loading !== null}
              required
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              disabled={loading !== null}
              required
            />

            <Button type="submit" disabled={loading !== null}>
              {loading === "email" ? "Creating account..." : "Create Account"}
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
            onClick={handleGoogleSignup}
            loading={loading === "google"}
          />

          <AuthFooter
            text="Already have an account?"
            linkText="Login"
            href="/auth/login"
          />
        </AuthCard>
        <Footer />
      </div>
    </main>
  );
}