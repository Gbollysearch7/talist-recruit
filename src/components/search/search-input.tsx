"use client";

import * as React from "react";
import { Search, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mocked recent searches ────────────────────────────────────────────────

const RECENT_SEARCHES = [
  "Senior React Developer in San Francisco",
  "Machine Learning Engineer Python",
  "Full Stack Developer remote",
  "Product Manager SaaS experience",
  "DevOps Engineer AWS Kubernetes",
];

// ─── Types ─────────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isSearching?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isSearching = false,
  className,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showRecent, setShowRecent] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close recent searches dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      setShowRecent(false);
      onSubmit(value.trim());
    }
  }

  function handleFocus() {
    setIsFocused(true);
    if (!value.trim()) {
      setShowRecent(true);
    }
  }

  function handleBlur() {
    setIsFocused(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    setShowRecent(!val.trim());
  }

  function handleRecentClick(search: string) {
    onChange(search);
    setShowRecent(false);
    onSubmit(search);
  }

  function handleClear() {
    onChange("");
    setShowRecent(false);
  }

  function handleSubmitClick() {
    if (value.trim()) {
      setShowRecent(false);
      onSubmit(value.trim());
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search bar */}
      <div
        className={cn(
          "flex items-center gap-3 border bg-[#121212] px-4 py-3 transition-colors duration-150",
          isFocused
            ? "border-white ring-1 ring-white/30"
            : "border-[#333]"
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isFocused ? "text-white" : "text-white/40"
          )}
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search for candidates..."
          disabled={isSearching}
          className={cn(
            "flex-1 bg-transparent text-lg text-white outline-none",
            "placeholder:text-[rgba(255,255,255,0.4)]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-white/40 transition-colors hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={!value.trim() || isSearching}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 border px-6 text-sm font-medium transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-white text-[#121212] border-white hover:bg-white/90 active:bg-white/80",
            "cursor-pointer select-none"
          )}
        >
          {isSearching ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-[#121212] border-t-transparent" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Recent searches dropdown */}
      {showRecent && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-[#333] bg-[#121212]">
          <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/40">
            Recent Searches
          </div>
          {RECENT_SEARCHES.map((search) => (
            <button
              key={search}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleRecentClick(search);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/80 transition-colors",
                "hover:bg-white/5 hover:text-white"
              )}
            >
              <Clock className="h-3.5 w-3.5 shrink-0 text-white/30" />
              <span className="truncate text-left">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
