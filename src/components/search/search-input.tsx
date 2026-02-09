"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ExcludeSearchesDropdown } from "@/components/search/exclude-searches-dropdown";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isSearching?: boolean;
  className?: string;
  resultCount: number;
  onResultCountChange: (count: number) => void;
  excludedSearchIds: Set<string>;
  onToggleExcludeSearch: (searchId: string) => void;
  showControls?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isSearching = false,
  className,
  resultCount,
  onResultCountChange,
  excludedSearchIds,
  onToggleExcludeSearch,
  showControls = true,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onSubmit(value.trim());
    }
  }

  function handleClear() {
    onChange("");
  }

  function handleSubmitClick() {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Search card container */}
      <div
        className={cn(
          "rounded border bg-[var(--bg-elevated)] border-[var(--border-light)]",
          "shadow-[var(--shadow-sm)] overflow-visible",
          isFocused && "border-[var(--border-focus)]"
        )}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            className={cn(
              "material-symbols-outlined shrink-0 transition-colors",
              isFocused ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            )}
            style={{ fontSize: 20 }}
          >
            search
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe the ideal candidate..."
            disabled={isSearching}
            className={cn(
              "flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none",
              "placeholder:text-[var(--text-muted)]",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                close
              </span>
            </button>
          )}
        </div>

        {/* Controls row */}
        {showControls && (
          <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-[var(--border-light)] bg-[var(--bg-surface)] overflow-visible relative">
            <div className="flex items-center gap-3">
              {/* Results count */}
              <label className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14 }}
                >
                  format_list_numbered
                </span>
                Results
                <select
                  value={resultCount}
                  onChange={(e) => onResultCountChange(Number(e.target.value))}
                  className={cn(
                    "h-7 px-2 rounded border border-[var(--border-light)]",
                    "bg-[var(--bg-elevated)] text-xs text-[var(--text-primary)]",
                    "focus:outline-none focus:border-[var(--border-focus)]"
                  )}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>

              {/* Divider */}
              <div className="w-px h-4 bg-[var(--border-light)]" />

              {/* Exclude Searches */}
              <ExcludeSearchesDropdown
                excludedSearchIds={excludedSearchIds}
                onToggleExclude={onToggleExcludeSearch}
              />
            </div>

            {/* Find Candidates button */}
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={!value.trim() || isSearching}
              className={cn(
                "btn btn-primary gap-1.5 px-4 py-2",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {isSearching ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    person_search
                  </span>
                  Find Candidates
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
