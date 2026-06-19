"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../lib/auth";
import { useUserProfile } from "../../hooks/useUserProfile";
import Footer from "../../components/layout/Footer";
import InstallAppButton from "../../components/pwa/InstallAppButton";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { profile, loading: profileLoading } = useUserProfile();

    const getFirstName = (name?: string | null) => {
    if (!name) return "";
    return name.trim().split(" ")[0];
    };

    const displayName =
    getFirstName(profile?.fullName) ||
    getFirstName(user?.displayName) ||
    "there";

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/login");
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
          py-10
          text-white
        "
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center">
          <div className="w-full">
            <header className="mb-10 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                  OneStep
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                    Welcome back, {profileLoading ? "..." : displayName}.
                </h1>

                <p className="mt-3 max-w-xl text-slate-400">
                  Slow down, check in with yourself, and focus on one task at a
                  time.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="
                  hidden
                  rounded-xl
                  border
                  border-slate-800
                  px-4
                  py-2
                  text-sm
                  text-slate-400
                  transition
                  hover:border-slate-700
                  hover:text-white
                  sm:block
                "
              >
                Logout
              </button>
            </header>

            <div
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
              <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Start your next gentle focus session.
                  </h2>

                  <p className="mt-3 text-slate-400">
                    First, take a short emotional check-in. Then choose one
                    small task and begin your timer.
                  </p>

                  <div className="mt-6 max-w-sm">
                    <Button onClick={() => router.push("/mood")}>
                      Start Check-In
                    </Button>
                  </div>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/50
                    p-5
                  "
                >
                  <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                    Today’s Flow
                  </p>

                  <div className="space-y-4">
                    <FlowStep number="1" title="Check your mood" />
                    <FlowStep number="2" title="Choose one task" />
                    <FlowStep number="3" title="Set your timer" />
                    <FlowStep number="4" title="Focus gently" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <DashboardCard
                title="Mood first"
                text="Your emotions matter before productivity."
              />

              <DashboardCard
                title="One task"
                text="No overwhelming lists. Just one clear focus."
              />

              <DashboardCard
                title="Gentle progress"
                text="Showing up counts, even when energy is low."
              />
            </div>
            <InstallAppButton />
            <div className="mt-6 sm:hidden">
              <button
                onClick={handleLogout}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  px-4
                  py-3
                  text-sm
                  text-slate-400
                  transition
                  hover:border-slate-700
                  hover:text-white
                "
              >
                Logout
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}

function FlowStep({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-blue-500/10
          text-sm
          font-semibold
          text-blue-400
        "
      >
        {number}
      </div>

      <p className="text-sm text-slate-300">{title}</p>
    </div>
  );
}

function DashboardCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/60
        p-5
      "
    >
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
    </div>
  );
}