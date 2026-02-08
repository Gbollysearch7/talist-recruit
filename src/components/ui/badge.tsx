import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-white/10 text-white border-transparent",
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning:
    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  error:
    "bg-red-500/15 text-red-400 border-red-500/20",
  outline:
    "bg-transparent text-[var(--mono-muted)] border-[var(--mono-border)]",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
