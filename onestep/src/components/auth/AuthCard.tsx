import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div
      className="
        w-full
        max-w-md
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
      {children}
    </div>
  );
}