import { Suspense } from "react";
import ResetPasswordClient from "../../../components/auth/ResetPasswordClient";

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <p className="text-slate-400">Preparing password reset...</p>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}