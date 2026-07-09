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
        py-3
        rounded-xl
        bg-blue-500
        hover:bg-blue-600
        text-white
        font-medium
        transition-all
        duration-200
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