import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        w-full
        min-h-12
        px-4
        rounded-xl
        bg-blue-500
        hover:bg-blue-600
        text-white
        font-medium
        transition-colors
        duration-150
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-blue-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}