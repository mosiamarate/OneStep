"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Footer from "../../components/layout/Footer";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Profile",
      href: "/settings/profile",
    },
    {
      label: "Account Security",
      href: "/settings/account",
    },
    {
      label: "Data & Privacy",
      href: "/settings/data",
    },
  ];

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
          <header className="mb-8 flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
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
              flex-1
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
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                Settings
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Account Settings
              </h1>
            </div>

            {/* Tab Navigation */}
            <nav
              aria-label="Settings navigation"
              className="mb-8 flex flex-wrap gap-2 border-b border-slate-800 pb-4"
            >
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
                      }
                    `}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            {children}
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
