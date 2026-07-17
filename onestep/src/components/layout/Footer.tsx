import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-10 border-t border-slate-800/70 px-4 py-6">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-col
          items-center
          justify-between
          gap-4
          text-center
          sm:flex-row
        "
      >
        <p className="text-sm text-slate-500">
          © {currentYear} OneStep. All rights reserved.
        </p>

        <nav
          aria-label="Legal links"
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/privacy"
            className="text-sm text-slate-500 transition hover:text-slate-300"
          >
            OneStep Privacy
          </Link>

          <Link
            href="/terms"
            className="text-sm text-slate-500 transition hover:text-slate-300"
          >
            OneStep Terms
          </Link>

          <span className="hidden text-slate-700 sm:inline">•</span>

          <p className="text-sm text-slate-600">
            Slow down. Focus gently.
          </p>
        </nav>
      </div>
    </footer>
  );
}