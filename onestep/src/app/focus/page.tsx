import { Suspense } from "react";
import FocusClient from "../../components/focus/FocusClient";

function FocusFallback() {
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