import Link from "next/link";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-b
        from-slate-950
        via-slate-900
        to-slate-950
        text-white
      "
    >
      <div className="flex min-h-screen flex-col">
        <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
            <div className="mb-6">
              <span className="text-6xl">🌿</span>
            </div>

            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-blue-400">
              OneStep
            </p>

            <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Slow down, relax, and focus on one task at a time.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              OneStep helps students and young professionals check in with how
              they feel, choose one small task, and begin a gentle focus session.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="
                  rounded-xl
                  bg-blue-500
                  px-8
                  py-4
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-600
                  active:scale-[0.98]
                "
              >
                Get Started
              </Link>

              <Link
                href="/auth/login"
                className="
                  rounded-xl
                  border
                  border-slate-700
                  px-8
                  py-4
                  font-medium
                  text-slate-300
                  transition
                  hover:border-slate-600
                  hover:text-white
                  active:scale-[0.98]
                "
              >
                I already have an account
              </Link>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-3">
              <FeatureCard
                title="Check in first"
                text="Start by noticing how you feel before jumping into tasks."
              />

              <FeatureCard
                title="Choose one task"
                text="Avoid overwhelming lists. Pick one clear thing to focus on."
              />

              <FeatureCard
                title="Focus gently"
                text="Set a timer that matches your energy and make calm progress."
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function FeatureCard({
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
        text-left
        backdrop-blur-xl
      "
    >
      <h2 className="font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {text}
      </p>
    </div>
  );
}