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
        rounded-3xl
        p-8
        shadow-2xl
      "
    >
      {children}
    </div>
  );
}