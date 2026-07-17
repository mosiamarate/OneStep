"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Footer from "../../components/layout/Footer";
import InstallAppButton from "../../components/pwa/InstallAppButton";
import { logoutUser } from "../../lib/auth";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";
import { getDashboardStats } from "../../services/dashboardService";
import {
  emptyDashboardStats,
  type DashboardStats,
} from "../../types/dashboard";

function getFirstName(name?: string | null) {
  if (!name) return "";

  return name.trim().split(" ")[0];
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const [stats, setStats] = useState<DashboardStats>(emptyDashboardStats);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const displayName =
    getFirstName(profile?.fullName) ||
    getFirstName(user?.displayName) ||
    "there";

  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardStats() {
      if (!user) return;

      try {
        setStatsLoading(true);
        setStatsError("");

        const dashboardStats = await getDashboardStats(user.uid);

        if (!cancelled) {
          setStats(dashboardStats);
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);

        if (!cancelled) {
          setStatsError("We couldn’t load your dashboard stats right now.");
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    loadDashboardStats();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <ProtectedRoute>
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-gradient-to-b
          from-slate-950
          via-slate-900
          to-slate-950
          px-4
          py-8
          text-white
        "
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
          <header className="mb-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/icons/icon-192x192.png"
                alt="OneStep logo"
                width={34}
                height={34}
                className="rounded-lg"
              />

              <span className="text-sm font-bold tracking-[0.35em] text-blue-400">
                OneStep
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={authLoading}
              className="
                rounded-xl
                border
                border-slate-700
                px-4
                py-2
                text-sm
                font-medium
                text-slate-300
                transition
                hover:border-slate-500
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Logout
            </button>
          </header>

          <div className="grid flex-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section
              className="
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/70
                p-6
                shadow-2xl
                backdrop-blur-xl
                md:p-8
              "
            >
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                Dashboard
              </p>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {greeting}, {profileLoading ? "..." : displayName}.
              </h1>

              <p className="max-w-2xl text-slate-400">
                Start calmly. Check in with yourself, choose one task, and focus
                gently.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/mood"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500
                    px-6
                    py-3
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-600
                    active:scale-[0.98]
                  "
                >
                  Start Check-In
                </Link>

                <Link
                  href="/task"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-700
                    px-6
                    py-3
                    font-medium
                    text-slate-300
                    transition
                    hover:border-slate-600
                    hover:text-white
                    active:scale-[0.98]
                  "
                >
                  Go to Task
                </Link>

                <Link
                  href="/history"
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-700
                    px-6
                    py-3
                    font-medium
                    text-slate-300
                    transition
                    hover:border-slate-600
                    hover:text-white
                    active:scale-[0.98]
                    sm:w-auto
                  "
                >
                  View History
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-500">Today’s mood</p>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {statsLoading
                      ? "..."
                      : stats.latestMood
                      ? `${stats.latestMood.emoji} ${stats.latestMood.label}`
                      : "No check-in"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-500">Focus time</p>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {statsLoading ? "..." : `${stats.focusMinutesToday} min`}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-500">Tasks completed</p>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {statsLoading ? "..." : stats.completedTasksToday}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-500">Focus sessions</p>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {statsLoading ? "..." : stats.focusSessionsToday}
                  </p>
                </div>
              </div>

              {statsError && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {statsError}
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Last focus
                </p>

                <h2 className="mt-3 text-xl font-semibold text-white">
                  {statsLoading
                    ? "Loading..."
                    : stats.lastFocusTask || "No focus session completed yet"}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {stats.lastFocusTask
                    ? "Good job showing up for one task today."
                    : "Your next focus session will appear here after you complete it."}
                </p>
              </div>

              <InstallAppButton />
            </section>

            <aside className="space-y-6">
              <div
                className="
                  rounded-3xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  p-6
                  shadow-2xl
                  backdrop-blur-xl
                "
              >
                <h2 className="text-xl font-semibold text-white">
                  Today’s Flow
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <p className="text-sm font-medium text-blue-300">
                      1. Check in
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Notice how you feel before you start.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm font-medium text-slate-200">
                      2. Choose one task
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Keep it small, clear, and realistic.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm font-medium text-slate-200">
                      3. Focus gently
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Use the timer and return when distracted.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="text-sm font-medium text-emerald-300">
                      4. Reflect
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Notice how you feel after focusing.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  rounded-3xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  p-6
                  shadow-2xl
                  backdrop-blur-xl
                "
              >
                <h2 className="text-xl font-semibold text-white">
                  Gentle reminder
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Progress is not only about doing more. Sometimes progress is
                  choosing one thing and giving it your attention.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}