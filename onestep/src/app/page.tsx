import Link from "next/link";
import Footer from "../components/layout/Footer";
import icon from "@/public/icons/icon-2000x2000.png"

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
              <img
                src={icon.src}
                alt="OneStep logo"
                width={70}
                height={70}
                className="mx-auto rounded-lg"
              />
            </div>

            <p className="mb-4 text-sm font-medium tracking-[0.35em] text-blue-400">
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

        <section className="mx-auto mt-24 max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 backdrop-blur-sm">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              What is OneStep?
            </p>

            <h2 className="mb-6 text-4xl font-bold text-white">
              Productivity without pressure.
            </h2>

            <div className="space-y-6 text-lg leading-8 text-slate-300">

              <p>
                OneStep is a mindful productivity app designed to help students,
                professionals, and anyone feeling overwhelmed slow down and focus on
                what matters most.
              </p>

              <p>
                Instead of encouraging long task lists and constant productivity,
                OneStep guides you through a simple routine that supports both your
                mental wellbeing and your ability to focus.
              </p>

              <p>
                Every session begins with a short emotional check-in, followed by one
                meaningful task, a distraction-free focus timer, and a brief reflection
                to help you understand how your focus affects your mood over time.
              </p>

            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 mb-24 max-w-6xl px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              How It Works
          </p>

          <h2 className="mb-10 text-4xl font-bold text-white">
              Five simple steps to calm productivity.
          </h2>

          <div className="grid gap-6 md:grid-cols-5">

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-300">
                      1
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white">
                      Check In
                  </h3>

                  <p className="text-slate-400">
                      Tell OneStep how you&apos;re feeling before starting your work.
                  </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-300">
                      2
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white">
                      Choose One Task
                  </h3>

                  <p className="text-slate-400">
                      Pick one meaningful task instead of a long overwhelming list.
                  </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-300">
                      3
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white">
                      Focus
                  </h3>

                  <p className="text-slate-400">
                      Start your timer and work without distractions.
                  </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-300">
                      4
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white">
                      Reflect
                  </h3>

                  <p className="text-slate-400">
                      After each session, record how you feel and notice patterns.
                  </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-300">
                      5
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white">
                      Grow
                  </h3>

                  <p className="text-slate-400">
                      View your history and celebrate consistent, gentle progress.
                  </p>

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