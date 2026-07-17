import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "../layout/Footer";

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageShell({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
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
        py-6
        text-white
        sm:px-6
        sm:py-8
        lg:px-8
      "
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Return to OneStep home"
          >
            <Image
              src="/icons/icon-192x192.png"
              alt="OneStep logo"
              width={32}
              height={32}
              className="rounded-lg"
            />

            <span className="text-sm font-bold tracking-[0.35em] text-blue-400">
              OneStep
            </span>
          </Link>

          <Link
            href="/"
            className="
              inline-flex
              items-center
              justify-center
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
            Back to OneStep
          </Link>
        </header>

        <article
          className="
            rounded-3xl
            border
            border-slate-800
            bg-slate-900/70
            p-5
            shadow-2xl
            backdrop-blur-xl
            sm:p-7
            md:p-10
          "
        >
          <header className="border-b border-slate-800 pb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              {eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
              {description}
            </p>

            <p className="mt-5 text-sm text-slate-500">
              Last updated: {lastUpdated}
            </p>
          </header>

          <div
            className="
              mt-8
              space-y-9
              text-[15px]
              leading-7
              text-slate-300
              sm:text-base
            "
          >
            {children}
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}