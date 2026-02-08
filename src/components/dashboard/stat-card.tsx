import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type StatCardVariant = "candidates" | "searches" | "pipeline" | "saved";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  change?: number;
  variant?: StatCardVariant;
  className?: string;
}

// ─── Color map per variant ──────────────────────────────────────────────────

const iconColorMap: Record<StatCardVariant, string> = {
  candidates: "text-emerald-400",
  searches: "text-sky-400",
  pipeline: "text-amber-400",
  saved: "text-violet-400",
};

const iconBgMap: Record<StatCardVariant, string> = {
  candidates: "bg-emerald-400/10 border-emerald-400/20",
  searches: "bg-sky-400/10 border-sky-400/20",
  pipeline: "bg-amber-400/10 border-amber-400/20",
  saved: "bg-violet-400/10 border-violet-400/20",
};

// ─── Component ──────────────────────────────────────────────────────────────

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  variant = "candidates",
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const formattedChange =
    change !== undefined
      ? `${isPositive ? "+" : ""}${change.toFixed(1)}%`
      : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-5",
        "bg-[var(--mono-bg,#121212)] border border-[var(--mono-border,#333333)]",
        "hover:border-white/20 transition-colors duration-150",
        className
      )}
    >
      {/* Header: icon + change */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center border",
            iconBgMap[variant]
          )}
        >
          <Icon className={cn("h-5 w-5", iconColorMap[variant])} />
        </div>

        {formattedChange && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formattedChange}
          </div>
        )}
      </div>

      {/* Value + label */}
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--mono-muted,rgba(255,255,255,0.6))]">
          {label}
        </span>
      </div>
    </div>
  );
}
