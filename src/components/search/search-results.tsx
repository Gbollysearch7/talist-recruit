"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandidateCard } from "@/components/search/candidate-card";
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

// ─── Skeleton Card ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col border border-[#333] bg-[#121212] p-5">
      {/* Header skeleton */}
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse bg-white/5" />
          <div className="h-3 w-1/2 animate-pulse bg-white/5" />
          <div className="h-3 w-2/5 animate-pulse bg-white/5" />
        </div>
      </div>
      {/* Skills skeleton */}
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-14 animate-pulse bg-white/5" />
        <div className="h-5 w-18 animate-pulse bg-white/5" />
        <div className="h-5 w-12 animate-pulse bg-white/5" />
        <div className="h-5 w-16 animate-pulse bg-white/5" />
      </div>
      {/* Summary skeleton */}
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full animate-pulse bg-white/5" />
        <div className="h-3 w-4/5 animate-pulse bg-white/5" />
      </div>
      {/* Actions skeleton */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-8 flex-1 animate-pulse bg-white/5" />
        <div className="h-8 w-24 animate-pulse bg-white/5" />
      </div>
    </div>
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
  // Loading state: show skeleton grid
  if (isSearching) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 animate-pulse bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state: no results after search
  if (hasSearched && results.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-[#333] bg-[#121212] px-6 py-16",
          className
        )}
      >
        <SearchX className="mb-4 h-12 w-12 text-white/20" />
        <h3 className="text-lg font-semibold text-white">
          No candidates found
        </h3>
        <p className="mt-2 max-w-md text-center text-sm text-[rgba(255,255,255,0.6)]">
          Try adjusting your search query or filters. You can broaden your
          search by removing specific skills or expanding the experience range.
        </p>
      </div>
    );
  }

  // No search yet: initial state
  if (!hasSearched) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-dashed border-[#333] bg-[#121212] px-6 py-16",
          className
        )}
      >
        <div className="mb-4 text-4xl text-white/10">//</div>
        <h3 className="text-lg font-semibold text-white">
          Search for candidates
        </h3>
        <p className="mt-2 max-w-md text-center text-sm text-[rgba(255,255,255,0.6)]">
          Enter a search query above to find candidates. Use filters to narrow
          down results by location, skills, experience, and more.
        </p>
      </div>
    );
  }

  // Results grid
  return (
    <div className={cn("space-y-4", className)}>
      {/* Results count */}
      <p className="text-sm text-[rgba(255,255,255,0.6)]">
        <span className="font-semibold text-white">{results.length}</span>{" "}
        candidate{results.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onSave={onSaveCandidate}
            isSaving={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
