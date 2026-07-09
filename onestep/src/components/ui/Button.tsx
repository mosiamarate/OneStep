import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  const widthClasses = fullWidth ? "w-full sm:w-auto" : "w-auto";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary:
      "border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/60",
    danger:
      "border border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200",
  };

  return (
    <button
      className={`${baseClasses} ${widthClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}