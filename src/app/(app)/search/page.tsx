"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";
import { useCandidates } from "@/hooks/use-candidates";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { SearchInput } from "@/components/search/search-input";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { SearchToolbar } from "@/components/search/search-toolbar";
import { SearchCriteriaPanel } from "@/components/search/search-criteria-panel";
import type { Candidate } from "@/types/database";

const EXAMPLE_QUERIES = [
  "5 Senior Software Engineers with Python experience",
  "Digital Marketing Managers in New York",
  "Frontend developers with React and TypeScript",
  "Data Scientists with machine learning background",
  "Product Designers who worked at startups",
  "DevOps engineers with Kubernetes and AWS",
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-full" />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
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
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [resultCount, setResultCount] = React.useState(10);
  const [selectedCandidateIds, setSelectedCandidateIds] = React.useState<
    Set<string>
  >(new Set());
  const [enrichments, setEnrichments] = React.useState<
    Record<string, boolean>
  >({
    email: true,
    seniority: false,
    interests: false,
    skills: false,
  });
  const [excludedSearchIds, setExcludedSearchIds] = React.useState<
    Set<string>
  >(new Set());

  // Auto-run search from URL params
  const initialQuery = searchParams.get("q");
  const lastAutoRunQuery = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (initialQuery && initialQuery !== lastAutoRunQuery.current) {
      lastAutoRunQuery.current = initialQuery;
      setQuery(initialQuery);
      setHasSearched(true);
      setTimeout(() => {
        search(initialQuery, { numResults: resultCount });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Clear selection when results change
  React.useEffect(() => {
    setSelectedCandidateIds(new Set());
  }, [results]);

  // ─── Parse criteria from query ──────────────────────────────────────
  const parsedCriteria = React.useMemo(() => {
    if (!query) return [];
    const terms: string[] = [];
    const words = query.split(/\s+/);
    const roleKeywords =
      /engineer|developer|manager|director|designer|analyst|lead|head|vp|cto|ceo|founder|consultant|product|marketing|senior|junior|principal|staff|recruiter|researcher|scientist|architect|strategist/i;
    const locationPreps = ["in", "at", "from", "near"];

    let rolePhrase = "";
    let locationPhrase = "";
    let inLocation = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const lower = word.toLowerCase();
      if (locationPreps.includes(lower) && i + 1 < words.length) {
        inLocation = true;
        continue;
      }
      if (inLocation) {
        locationPhrase += (locationPhrase ? " " : "") + word;
      } else {
        rolePhrase += (rolePhrase ? " " : "") + word;
      }
    }

    if (rolePhrase) terms.push(rolePhrase);
    if (locationPhrase) terms.push(locationPhrase);
    terms.push("Professional profile");
    return terms;
  }, [query]);

  // ─── Handlers ──────────────────────────────────────────────────────
  function handleSearch(searchQuery: string) {
    setHasSearched(true);
    search(searchQuery, {
      ...filters,
      numResults: resultCount,
      excludeSearchIds: Array.from(excludedSearchIds),
    });
  }

  function handleApplyFilters() {
    if (query.trim()) {
      setHasSearched(true);
      search(query, { ...filters, numResults: resultCount });
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

  function handleSaveSelected() {
    for (const result of results) {
      const key = result.exa_id || result.id;
      if (selectedCandidateIds.has(key)) {
        handleSaveCandidate(result);
      }
    }
    setSelectedCandidateIds(new Set());
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

  function toggleEnrichment(key: string) {
    setEnrichments((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleSelect(id: string) {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedCandidateIds.size === results.length) {
      setSelectedCandidateIds(new Set());
    } else {
      setSelectedCandidateIds(
        new Set(results.map((c) => c.exa_id || c.id))
      );
    }
  }

  function handleExampleClick(exampleQuery: string) {
    setQuery(exampleQuery);
    handleSearch(exampleQuery);
  }

  function toggleExcludeSearch(searchId: string) {
    setExcludedSearchIds((prev) => {
      const next = new Set(prev);
      if (next.has(searchId)) next.delete(searchId);
      else next.add(searchId);
      return next;
    });
  }

  function handleFindMore() {
    const newCount = resultCount + 10;
    setResultCount(newCount);
    search(query, { ...filters, numResults: newCount });
  }

  function handleExport() {
    // TODO: implement CSV export
  }

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-full">
      {/* ═══════════════════════════════════════════════════════════════
          PRE-SEARCH STATE
          ═══════════════════════════════════════════════════════════════ */}
      {!hasSearched && (
        <>
          {/* Hero */}
          <div className="text-center mb-6 pt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-surface)] px-3 py-1 mb-4">
              <span
                className="material-symbols-outlined text-[var(--primary)]"
                style={{ fontSize: 14 }}
              >
                auto_awesome
              </span>
              <span className="text-[10px] font-medium text-[var(--primary)] uppercase tracking-wide">
                AI-Powered Search
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Find your ideal candidates
            </h1>
            <p className="mt-2 text-sm text-[var(--text-tertiary)] max-w-lg mx-auto">
              Describe who you&apos;re looking for in plain English. Our AI
              searches the entire web to find people who match.
            </p>
          </div>

          {/* Search Input with controls */}
          <div className="max-w-3xl mx-auto">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              isSearching={isSearching}
              resultCount={resultCount}
              onResultCountChange={setResultCount}
              excludedSearchIds={excludedSearchIds}
              onToggleExcludeSearch={toggleExcludeSearch}
            />
          </div>

          {/* Example Queries */}
          <div className="mt-10 max-w-3xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 text-center">
              Try an example
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {EXAMPLE_QUERIES.map((exampleQuery) => (
                <button
                  key={exampleQuery}
                  type="button"
                  onClick={() => handleExampleClick(exampleQuery)}
                  className={cn(
                    "text-left px-3 py-2.5 rounded border border-[var(--border-light)]",
                    "text-xs text-[var(--text-tertiary)]",
                    "hover:text-[var(--text-primary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)]",
                    "transition-colors duration-150"
                  )}
                >
                  {exampleQuery}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          POST-SEARCH STATE
          ═══════════════════════════════════════════════════════════════ */}
      {hasSearched && (
        <>
          {/* Compact search input (no controls row in post-search) */}
          <SearchInput
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            isSearching={isSearching}
            resultCount={resultCount}
            onResultCountChange={setResultCount}
            excludedSearchIds={excludedSearchIds}
            onToggleExcludeSearch={toggleExcludeSearch}
            showControls={false}
          />

          {/* Save Search Dialog (inline) */}
          {showSaveDialog && (
            <div className="mt-2 flex items-center justify-end gap-2">
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
                className="input-base w-48 h-8"
              />
              <button
                type="button"
                onClick={handleSaveSearch}
                disabled={!searchName.trim() || isSavingSearch}
                className="btn btn-primary disabled:opacity-50"
              >
                {isSavingSearch ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancelSaveSearch}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="mt-3">
            <SearchToolbar
              selectedCount={selectedCandidateIds.size}
              showAdvanced={showAdvanced}
              onFilter={() => setShowAdvanced(!showAdvanced)}
              onExport={handleExport}
              onSaveSelected={handleSaveSelected}
              onEnrichment={() => {}}
              onSaveSearch={handleSaveSearch}
              isSaving={isSaving}
              isSavingSearch={isSavingSearch}
            />
          </div>

          {/* Advanced Filter Panel */}
          {showAdvanced && (
            <div className="mt-2 rounded border border-[var(--border-light)] bg-[var(--bg-surface)] p-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Search Criteria
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mb-3">
                  Add specific requirements candidates must meet
                </p>
                <SearchFilters
                  filters={filters}
                  onChange={setFilters}
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                  embedded
                />
              </div>
            </div>
          )}

          {/* Two-column layout: Results (left) + Criteria Panel (right) */}
          <div className="flex gap-0">
            {/* Left: Results Table + Bottom Bar */}
            <div className="flex-1 min-w-0">
              <SearchResults
                results={results}
                isSearching={isSearching}
                hasSearched={hasSearched}
                onSaveCandidate={handleSaveCandidate}
                isSaving={isSaving}
                startIndex={0}
                selectedIds={selectedCandidateIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                criteria={parsedCriteria}
              />

              {/* Bottom Bar */}
              {results.length > 0 && !isSearching && (
                <div className="flex items-center justify-between border border-[var(--border-light)] border-t-0 bg-[var(--bg-elevated)] px-4 py-2">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    <span className="text-[var(--text-primary)] font-medium">
                      {results.length}
                    </span>{" "}
                    / match
                  </span>

                  <div className="flex items-center gap-1">
                    {[25, 100].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setResultCount(n);
                          search(query, { ...filters, numResults: n });
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded text-xs transition-colors",
                          resultCount === n
                            ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Custom
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleFindMore}
                    className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                  >
                    Find more results
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14 }}
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Criteria + Enrichments Panel */}
            <div className="shrink-0 hidden lg:block">
              <SearchCriteriaPanel
                query={query}
                enrichments={enrichments}
                onToggleEnrichment={toggleEnrichment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
