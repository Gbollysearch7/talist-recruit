"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSearchHistory,
  type SearchHistoryItem,
} from "@/hooks/use-search-history";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SearchHistorySidebarProps {
  collapsed: boolean;
  onSelectSearch: (query: string, filters: Record<string, unknown> | null) => void;
}

// ─── Section ───────────────────────────────────────────────────────────────

function HistorySection({
  title,
  items,
  count,
  onSelectSearch,
}: {
  title: string;
  items: SearchHistoryItem[];
  count?: number;
  onSelectSearch: (query: string, filters: Record<string, unknown> | null) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--mono-ghost)]">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-[10px] text-[var(--mono-ghost)]">{count}</span>
        )}
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelectSearch(item.query, item.filters)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left",
                "text-[12px] text-[var(--mono-muted)]",
                "hover:text-[var(--mono-fg)] hover:bg-[var(--mono-whisper)]",
                "transition-colors duration-150 rounded-md",
              )}
              title={item.query}
            >
              <CheckCircle2
                className="h-3.5 w-3.5 shrink-0 text-[var(--mono-accent-green)]"
                strokeWidth={1.5}
              />
              <span className="truncate">{item.query}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export function SearchHistorySidebar({
  collapsed,
  onSelectSearch,
}: SearchHistorySidebarProps) {
  const { grouped, totalCount, isLoading } = useSearchHistory();

  if (collapsed) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--mono-ghost)]" />
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="px-3 py-4">
        <p className="text-[11px] text-[var(--mono-ghost)] text-center">
          No search history yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto max-h-[40vh]">
      <HistorySection
        title="Today"
        items={grouped.today}
        count={grouped.today.length}
        onSelectSearch={onSelectSearch}
      />
      <HistorySection
        title="Previous 7 Days"
        items={grouped.previous7Days}
        count={grouped.previous7Days.length}
        onSelectSearch={onSelectSearch}
      />
      <HistorySection
        title="Previous 30 Days"
        items={grouped.previous30Days}
        count={grouped.previous30Days.length}
        onSelectSearch={onSelectSearch}
      />
      <HistorySection
        title="Older"
        items={grouped.older}
        count={grouped.older.length}
        onSelectSearch={onSelectSearch}
      />

      {/* Total count */}
      <div className="px-3 py-2 border-t border-[var(--mono-border)] mt-1">
        <span className="text-[11px] text-[var(--mono-ghost)]">
          {totalCount} searches
        </span>
      </div>
    </div>
  );
}
