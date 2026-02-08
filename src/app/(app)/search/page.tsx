"use client";

import * as React from "react";
import {
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";
import { useCandidates } from "@/hooks/use-candidates";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { SearchInput } from "@/components/search/search-input";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import type { Candidate } from "@/types/database";

// ─── Constants ─────────────────────────────────────────────────────────────

const RESULTS_PER_PAGE = 12;

// ─── Page Component ────────────────────────────────────────────────────────

export default function SearchPage() {
  const {
    search,
    results,
    isSearching,
    query,
    filters,
    setQuery,
    setFilters,
    clearResults,
  } = useSearch();

  const { saveCandidate, isSaving } = useCandidates();
  const { saveSearch, isSaving: isSavingSearch } = useSavedSearches();

  const [hasSearched, setHasSearched] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");

  // ── Pagination ──────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // Reset to page 1 when results change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleSearch(searchQuery: string) {
    setHasSearched(true);
    search(searchQuery, filters);
  }

  function handleApplyFilters() {
    if (query.trim()) {
      setHasSearched(true);
      search(query, filters);
    }
  }

  function handleClearFilters() {
    setFilters({
      location: undefined,
      title: undefined,
      company: undefined,
      skills: undefined,
      experienceMin: undefined,
      experienceMax: undefined,
    });
    if (query.trim()) {
      search(query, {});
    }
  }

  function handleSaveCandidate(candidate: Candidate) {
    saveCandidate({
      name: candidate.name,
      exa_id: candidate.exa_id ?? candidate.id,
      title: candidate.title,
      company: candidate.company,
      location: candidate.location,
      linkedin_url: candidate.linkedin_url,
      email: candidate.email,
      skills: candidate.skills,
      experience_years: candidate.experience_years,
      summary: candidate.summary,
      source: candidate.source,
    });
  }

  function handleSaveSearch() {
    if (showSaveDialog && searchName.trim()) {
      saveSearch({
        name: searchName.trim(),
        query,
        filters: filters as Record<string, unknown>,
      });
      setSearchName("");
      setShowSaveDialog(false);
    } else {
      setShowSaveDialog(true);
    }
  }

  function handleCancelSaveSearch() {
    setShowSaveDialog(false);
    setSearchName("");
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Search</h1>
            <p className="mt-1 text-sm text-[rgba(255,255,255,0.6)]">
              Find and discover candidates using AI-powered search
            </p>
          </div>
          {hasSearched && query.trim() && (
            <div className="flex items-center gap-2">
              {showSaveDialog ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveSearch();
                      if (e.key === "Escape") handleCancelSaveSearch();
                    }}
                    placeholder="Search name..."
                    autoFocus
                    className={cn(
                      "h-9 w-48 border border-[#333] bg-[#121212] px-3 text-sm text-white",
                      "placeholder:text-white/30",
                      "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30"
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleSaveSearch}
                    disabled={!searchName.trim() || isSavingSearch}
                    className={cn(
                      "inline-flex h-9 items-center justify-center gap-1.5 border px-4 text-xs font-medium transition-colors duration-150",
                      "bg-white text-[#121212] border-white hover:bg-white/90",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "cursor-pointer select-none"
                    )}
                  >
                    {isSavingSearch ? "Saving..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelSaveSearch}
                    className={cn(
                      "inline-flex h-9 items-center justify-center border border-[#333] px-4 text-xs font-medium text-white transition-colors duration-150",
                      "hover:bg-white/5 cursor-pointer select-none"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-1.5 border px-4 text-xs font-medium transition-colors duration-150",
                    "bg-transparent text-white border-[#333] hover:bg-white/5 active:bg-white/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                    "cursor-pointer select-none"
                  )}
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  Save Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search Input */}
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          isSearching={isSearching}
        />

        {/* Filters */}
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          className="mt-4"
        />

        {/* Results */}
        <SearchResults
          results={paginatedResults}
          isSearching={isSearching}
          hasSearched={hasSearched}
          onSaveCandidate={handleSaveCandidate}
          isSaving={isSaving}
          className="mt-6"
        />

        {/* Pagination */}
        {hasSearched && results.length > RESULTS_PER_PAGE && !isSearching && (
          <div className="mt-8 flex items-center justify-center gap-1">
            {/* Previous */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center border border-[#333] text-white transition-colors duration-150",
                "hover:bg-white/5 active:bg-white/10",
                "disabled:pointer-events-none disabled:opacity-30",
                "cursor-pointer select-none"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;

              // Show first, last, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              // Show ellipsis
              const showEllipsisBefore =
                page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter =
                page === currentPage + 2 && currentPage < totalPages - 2;

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <span
                    key={page}
                    className="inline-flex h-9 w-9 items-center justify-center text-sm text-white/30"
                  >
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center border text-sm font-medium transition-colors duration-150",
                    "cursor-pointer select-none",
                    isActive
                      ? "border-white bg-white text-[#121212]"
                      : "border-[#333] text-white hover:bg-white/5 active:bg-white/10"
                  )}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center border border-[#333] text-white transition-colors duration-150",
                "hover:bg-white/5 active:bg-white/10",
                "disabled:pointer-events-none disabled:opacity-30",
                "cursor-pointer select-none"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Page info */}
        {hasSearched && results.length > RESULTS_PER_PAGE && !isSearching && (
          <p className="mt-3 text-center text-xs text-[rgba(255,255,255,0.4)]">
            Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1}--
            {Math.min(currentPage * RESULTS_PER_PAGE, results.length)} of{" "}
            {results.length} candidates
          </p>
        )}
      </div>
    </div>
  );
}
