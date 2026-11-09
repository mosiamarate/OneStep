import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div
      className="
        bg-slate-900/70
        backdrop-blur-xl
        border
        border-slate-800
        rounded-2xl
        p-5
        shadow-2xl
        sm:rounded-3xl
        sm:p-8
      "
    >
      {children}
    </div>
  );
}