import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        min-h-12
        bg-slate-950/50
        border
        border-slate-700
        rounded-xl
        px-4
        py-3
        text-white
        placeholder:text-slate-500
        focus:border-blue-400
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-400/40
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}