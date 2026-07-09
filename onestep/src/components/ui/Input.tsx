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
        bg-slate-950/50
        border
        border-slate-700
        rounded-xl
        px-4
        py-3
        text-white
        placeholder:text-slate-500
        focus:border-blue-500
        focus:outline-none
        transition
        ${className}
      `}
      {...props}
    />
  );
}