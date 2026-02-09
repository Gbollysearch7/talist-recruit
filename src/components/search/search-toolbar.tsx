"use client";

import { cn } from "@/lib/utils";

interface SearchToolbarProps {
  selectedCount: number;
  showAdvanced: boolean;
  onFilter: () => void;
  onExport: () => void;
  onSaveSelected: () => void;
  onEnrichment: () => void;
  onSaveSearch: () => void;
  isExporting?: boolean;
  isSaving?: boolean;
  isSavingSearch?: boolean;
}

export function SearchToolbar({
  selectedCount,
  showAdvanced,
  onFilter,
  onExport,
  onSaveSelected,
  onEnrichment,
  onSaveSearch,
  isExporting,
  isSaving,
  isSavingSearch,
}: SearchToolbarProps) {
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

        <button className="btn btn-ghost">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            swap_vert
          </span>
          Sort
        </button>

        <button className="btn btn-ghost font-mono">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            code
          </span>
          Get Code
        </button>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="btn btn-ghost disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            download
          </span>
          Export
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
            <button className="btn btn-ghost text-[var(--error-text)]">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                delete
              </span>
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
            notifications
          </span>
          Monitor for New People
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
