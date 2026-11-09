"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function AuthInput({
  label,
  error,
  id,
  required,
  showPasswordToggle = false,
  ...props
}: AuthInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId =
    id || label.toLowerCase().replace(/\s+/g, "-");
  const canTogglePassword = showPasswordToggle && props.type === "password";

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      <div className="relative">
        <Input
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
          type={
            showPasswordToggle && passwordVisible
              ? "text"
              : props.type
          }
          className={canTogglePassword ? "pr-14" : ""}
        />
        {canTogglePassword && (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-pressed={passwordVisible}
            className="
              absolute
              right-1
              top-1/2
              inline-flex
              min-h-11
              min-w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-800
              hover:text-white
              focus-visible:outline-2
              focus-visible:outline-offset-1
              focus-visible:outline-blue-300
            "
          >
            {passwordVisible ? (
              <EyeOff aria-hidden="true" size={19} />
            ) : (
              <Eye aria-hidden="true" size={19} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}