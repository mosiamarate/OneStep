import { Suspense } from "react";
import FocusClient from "../../components/focus/FocusClient";

function FocusFallback() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <p className="text-slate-400">Preparing your focus space...</p>
    </main>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={<FocusFallback />}>
      <FocusClient />
    </Suspense>

  );
}