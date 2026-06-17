export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/70 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row">
        <p className="text-sm text-slate-500">
          © {currentYear} OneStep. All rights reserved.
        </p>

        <p className="text-sm text-slate-600">
          Slow down. Focus gently.
        </p>
      </div>
    </footer>
  );
}