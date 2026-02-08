"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--mono-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "h-10 w-full rounded-md border border-[var(--mono-border)] bg-[var(--mono-bg,#121212)] px-3 py-2 text-sm text-white",
            "placeholder:text-[var(--mono-muted)]",
            "focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-150",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
