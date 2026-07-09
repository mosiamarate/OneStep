import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  className = "",
  error = false,
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        rounded-xl
        border
        bg-slate-950/70
        px-4
        py-3
        text-sm
        text-white
        outline-none
        transition
        placeholder:text-slate-600
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          error
            ? "border-red-500/60 focus:border-red-400"
            : "border-slate-800 focus:border-blue-500/60"
        }
        ${className}
      `}
      {...props}
    />
  );
}