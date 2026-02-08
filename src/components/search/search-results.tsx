"use client";

import * as React from "react";
import { SearchX, Bookmark, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/database";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SearchResultsProps {
  results: Candidate[];
  isSearching: boolean;
  hasSearched: boolean;
  onSaveCandidate: (candidate: Candidate) => void;
  isSaving?: boolean;
  className?: string;
}

// ─── Skeleton Row ──────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-[#333]">
      <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-40 animate-pulse bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-28 animate-pulse bg-white/5" /></td>
      <td className="hidden px-4 py-3 lg:table-cell"><div className="h-4 w-48 animate-pulse bg-white/5" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse bg-white/5" /></td>
    </tr>
  );
}

// ─── Table Header ──────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <thead>
      <tr className="border-b border-[#333] bg-white/[0.03]">
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Name</th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Title</th>
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Company</th>
        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50 lg:table-cell">Summary</th>
        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Actions</th>
      </tr>
    </thead>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export function SearchResults({
  results,
  isSearching,
  hasSearched,
  onSaveCandidate,
  isSaving = false,
  className,
}: SearchResultsProps) {
  // Loading state
  if (isSearching) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-4 w-32 animate-pulse bg-white/5" />
        <div className="overflow-x-auto border border-[#333]">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (hasSearched && results.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-[#333] bg-[#121212] px-6 py-16",
          className
        )}
      >
        <SearchX className="mb-4 h-12 w-12 text-white/20" />
        <h3 className="text-lg font-semibold text-white">No candidates found</h3>
        <p className="mt-2 max-w-md text-center text-sm text-[rgba(255,255,255,0.6)]">
          Try adjusting your search query or filters. You can broaden your
          search by removing specific skills or expanding the experience range.
        </p>
      </div>
    );
  }

  // No search yet
  if (!hasSearched) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-dashed border-[#333] bg-[#121212] px-6 py-16",
          className
        )}
      >
        <div className="mb-4 text-4xl text-white/10">//</div>
        <h3 className="text-lg font-semibold text-white">Search for candidates</h3>
        <p className="mt-2 max-w-md text-center text-sm text-[rgba(255,255,255,0.6)]">
          Enter a search query above to find candidates. Use filters to narrow
          down results by location, skills, experience, and more.
        </p>
      </div>
    );
  }

  // Results table
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-[rgba(255,255,255,0.6)]">
        <span className="font-semibold text-white">{results.length}</span>{" "}
        candidate{results.length !== 1 ? "s" : ""} found
      </p>

      <div className="overflow-x-auto border border-[#333]">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {results.map((candidate, index) => (
              <tr
                key={candidate.exa_id || candidate.id || index}
                className="border-b border-[#333] transition-colors hover:bg-white/[0.02]"
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#333] bg-white/5 text-[11px] font-bold text-white">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="block max-w-[200px] truncate text-sm font-medium text-white">
                      {candidate.name}
                    </span>
                  </div>
                </td>

                {/* Title */}
                <td className="px-4 py-3">
                  <span className="block max-w-[180px] truncate text-sm text-white/70">
                    {candidate.title || "—"}
                  </span>
                </td>

                {/* Company */}
                <td className="px-4 py-3">
                  <span className="block max-w-[150px] truncate text-sm text-white/70">
                    {candidate.company || "—"}
                  </span>
                </td>

                {/* Summary */}
                <td className="hidden px-4 py-3 lg:table-cell">
                  <p className="line-clamp-2 max-w-[300px] text-xs text-white/50">
                    {candidate.summary || "—"}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onSaveCandidate(candidate)}
                      disabled={isSaving}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 border px-2.5 text-[11px] font-medium transition-colors duration-150",
                        "bg-white text-[#121212] border-white hover:bg-white/90",
                        "disabled:pointer-events-none disabled:opacity-50",
                        "cursor-pointer select-none"
                      )}
                    >
                      <Bookmark className="h-3 w-3" />
                      Save
                    </button>
                    {candidate.linkedin_url && (
                      <a
                        href={candidate.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 border px-2.5 text-[11px] font-medium transition-colors duration-150",
                          "bg-transparent text-white border-[#333] hover:bg-white/5"
                        )}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Profile
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
