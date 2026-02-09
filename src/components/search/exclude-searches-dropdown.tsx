"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSearchHistory } from "@/hooks/use-search-history";

interface ExcludeSearchesDropdownProps {
  excludedSearchIds: Set<string>;
  onToggleExclude: (searchId: string) => void;
}

export function ExcludeSearchesDropdown({
  excludedSearchIds,
  onToggleExclude,
}: ExcludeSearchesDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { searches, isLoading } = useSearchHistory();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "btn btn-secondary gap-1.5",
          excludedSearchIds.size > 0 && "border-[var(--warning)] text-[var(--warning-text)]"
        )}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16 }}
        >
          filter_list_off
        </span>
        Exclude Searches
        {excludedSearchIds.size > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning-text)] text-[10px] font-bold">
            {excludedSearchIds.size}
          </span>
        )}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 14 }}
        >
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 w-80 z-50",
            "bg-[var(--bg-elevated)] border border-[var(--border-light)]",
            "rounded shadow-[var(--shadow-md)]",
            "max-h-72 overflow-y-auto"
          )}
        >
          <div className="px-3 py-2 border-b border-[var(--border-light)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Previous Searches
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Select searches to exclude their candidates from new results
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <span className="text-xs text-[var(--text-muted)]">Loading...</span>
            </div>
          ) : searches.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-[var(--text-muted)]">
                No previous searches found
              </p>
            </div>
          ) : (
            <div className="py-1">
              {searches.map((search) => {
                const isExcluded = excludedSearchIds.has(search.id);
                return (
                  <button
                    key={search.id}
                    type="button"
                    onClick={() => onToggleExclude(search.id)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2 text-left",
                      "hover:bg-[var(--bg-surface)] transition-colors duration-100"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isExcluded}
                      readOnly
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs truncate",
                        isExcluded
                          ? "text-[var(--text-primary)] font-medium"
                          : "text-[var(--text-secondary)]"
                      )}>
                        {search.query}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {search.results_count ?? 0} results
                        {" · "}
                        {new Date(search.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {excludedSearchIds.size > 0 && (
            <div className="px-3 py-2 border-t border-[var(--border-light)] bg-[var(--warning-bg)]">
              <p className="text-[10px] text-[var(--warning-text)]">
                {excludedSearchIds.size} search{excludedSearchIds.size > 1 ? "es" : ""} excluded — candidates from those searches won&apos;t appear in new results
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
