"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { hasVerifiedEmailCookie } from "../../lib/authCookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
      return;
    }

    if (!loading && user && !hasVerifiedEmailCookie()) {
      router.replace("/auth/verify-email");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    );
  }

  if (!user || !hasVerifiedEmailCookie()) {
    return null;
  }

  return <>{children}</>;
}
