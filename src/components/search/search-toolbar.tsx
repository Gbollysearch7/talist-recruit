"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SortOption = "relevance" | "name" | "company" | "title";

interface SearchToolbarProps {
  selectedCount: number;
  showAdvanced: boolean;
  onFilter: () => void;
  onExport: () => void;
  onSaveSelected: () => void;
  onEnrichment: () => void;
  onSaveSearch: () => void;
  onSort?: (sort: SortOption) => void;
  currentSort?: SortOption;
  isExporting?: boolean;
  isSaving?: boolean;
  isSavingSearch?: boolean;
  hasResults?: boolean;
}

export function SearchToolbar({
  selectedCount,
  showAdvanced,
  onFilter,
  onExport,
  onSaveSelected,
  onEnrichment,
  onSaveSearch,
  onSort,
  currentSort = "relevance",
  isExporting,
  isSaving,
  isSavingSearch,
  hasResults,
}: SearchToolbarProps) {
  const [showSort, setShowSort] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);
  const codeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
      if (codeRef.current && !codeRef.current.contains(event.target as Node)) {
        setShowCode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Relevance" },
    { value: "name", label: "Name (A-Z)" },
    { value: "company", label: "Company" },
    { value: "title", label: "Job Title" },
  ];

  return (
    <div className="flex items-center justify-between h-10 border border-[var(--border-light)] bg-[var(--bg-elevated)] px-3 rounded-t">
      {/* Left side buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onFilter}
          className={cn(
            "btn btn-ghost",
            showAdvanced && "bg-[var(--bg-surface)] text-[var(--text-primary)]"
          )}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            filter_list
          </span>
          Filter
        </button>

        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className={cn(
              "btn btn-ghost",
              showSort && "bg-[var(--bg-surface)] text-[var(--text-primary)]"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              swap_vert
            </span>
            Sort
            {currentSort !== "relevance" && (
              <span className="ml-0.5 px-1 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] text-[9px] font-bold">
                1
              </span>
            )}
          </button>
          {showSort && (
            <div className="absolute top-full left-0 mt-1 w-40 z-50 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded shadow-[var(--shadow-md)]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSort?.(opt.value);
                    setShowSort(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors",
                    "hover:bg-[var(--bg-surface)]",
                    currentSort === opt.value
                      ? "text-[var(--primary)] font-medium"
                      : "text-[var(--text-secondary)]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Get Code dropdown */}
        <div ref={codeRef} className="relative">
          <button
            onClick={() => setShowCode(!showCode)}
            className={cn(
              "btn btn-ghost font-mono",
              showCode && "bg-[var(--bg-surface)] text-[var(--text-primary)]"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              code
            </span>
            Get Code
          </button>
          {showCode && (
            <div className="absolute top-full left-0 mt-1 w-72 z-50 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded shadow-[var(--shadow-md)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                API Snippet
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)] mb-2">
                Coming soon — programmatic access to search results via the Talist API.
              </p>
              <div className="bg-[var(--bg-surface)] rounded p-2 text-[10px] font-mono text-[var(--text-secondary)]">
                <code>GET /api/search?q=...</code>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onExport}
          disabled={isExporting || !hasResults}
          className="btn btn-ghost disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            download
          </span>
          {isExporting ? "Exporting..." : "Export"}
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-[var(--border-light)] mx-1" />

        {selectedCount > 0 && (
          <>
            <button
              onClick={onSaveSelected}
              disabled={isSaving}
              className="btn btn-ghost text-[var(--primary)] disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                bookmark
              </span>
              Save {selectedCount}
            </button>
            <div className="w-px h-4 bg-[var(--border-light)] mx-1" />
          </>
        )}
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSaveSearch}
          disabled={isSavingSearch}
          className="btn btn-secondary disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            bookmark_add
          </span>
          Save Search
        </button>

        <button
          onClick={onEnrichment}
          className="btn btn-primary"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            add
          </span>
          Add Enrichment
        </button>
      </div>
    </div>
  );
}
