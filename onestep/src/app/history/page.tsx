"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import { getFocusHistory } from "../../services/historyService";
import type { HistoryItem } from "../../types/history";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!user) return;

      try {
        setLoadingHistory(true);
        setHistoryError("");

        const items = await getFocusHistory(user.uid);

        if (!cancelled) {
          setHistory(items);
        }
      } catch (error) {
        console.error("Error loading focus history:", error);

        if (!cancelled) {
          setHistoryError("We couldn’t load your focus history right now.");
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <ProtectedRoute>
      <main
        className="
          relative
          min-h-dvh
          w-full
          overflow-x-hidden
          bg-gradient-to-b
          from-slate-950
          via-slate-900
          to-slate-950
          px-4
          py-8
          text-white
          sm:px-6
          lg:px-8
        "
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col">
          <header className="mb-10 flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/icons/icon-192x192.png"
                alt="OneStep logo"
                width={32}
                height={32}
                className="rounded-lg"
              />

              <span className="text-sm font-bold tracking-[0.35em] text-blue-400">
                ONESTEP
              </span>
            </Link>

            <Link
              href="/dashboard"
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
              "
            >
              Dashboard
            </Link>
          </header>

          <div
            className="
              rounded-3xl
              border
              border-slate-800
              bg-slate-900/70
              p-5
              shadow-2xl
              backdrop-blur-xl
              sm:p-6
              md:p-8
            "
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              History
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Your focus history.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              A calm record of the sessions you completed. This helps you see
              that every small step still counts.
            </p>

            {historyError && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {historyError}
              </div>
            )}

            {loadingHistory || authLoading ? (
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                <p className="text-slate-400">Loading your history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                <h2 className="text-xl font-semibold text-white">
                  No focus sessions yet.
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Complete your first focus session and it will appear here.
                </p>

                <Link
                  href="/mood"
                  className="
                    mt-5
                    inline-flex
                    w-full
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
                    sm:w-auto
                  "
                >
                  Start Check-In
                </Link>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {history.map((item) => (
                  <article
                    key={item.id}
                    className="
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-950/40
                      p-5
                      transition
                      hover:border-slate-700
                    "
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {item.dateLabel} • {item.timeLabel}
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-white">
                          {item.taskTitle}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                            {item.durationMinutes} min
                          </span>

                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                            Completed
                          </span>

                          {item.afterMoodLabel && (
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                              {item.afterMoodEmoji} {item.afterMoodLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-center">
                        <p className="text-2xl font-semibold text-white">
                          {item.durationMinutes}
                        </p>
                        <p className="text-xs text-slate-500">minutes</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}