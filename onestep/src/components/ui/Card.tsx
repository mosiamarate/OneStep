import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
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