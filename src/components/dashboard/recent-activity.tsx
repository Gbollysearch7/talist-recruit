"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, UserPlus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecentSearchItem, RecentCandidateItem } from "@/hooks/use-stats";

// ─── Recent Searches ────────────────────────────────────────────────────────

interface RecentSearchesProps {
  searches: RecentSearchItem[];
  className?: string;
}

export function RecentSearches({ searches, className }: RecentSearchesProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded border border-[var(--border-light)] bg-[var(--bg-elevated)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Recent Searches
          </h3>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-150"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border-light)]">
        {searches.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--text-tertiary)]">
            No recent searches yet.
          </div>
        ) : (
          searches.map((search) => (
            <Link
              key={search.id}
              href={`/search?q=${encodeURIComponent(search.query)}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-surface)] transition-colors duration-150"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm text-[var(--text-primary)] truncate">
                  {search.query}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {search.results_count} result{search.results_count !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="shrink-0 text-xs text-[var(--text-muted)]">
                {formatDistanceToNow(new Date(search.created_at), {
                  addSuffix: true,
                })}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Recent Candidates ──────────────────────────────────────────────────────

interface RecentCandidatesProps {
  candidates: RecentCandidateItem[];
  className?: string;
}

export function RecentCandidates({
  candidates,
  className,
}: RecentCandidatesProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded border border-[var(--border-light)] bg-[var(--bg-elevated)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Recent Candidates
          </h3>
        </div>
        <Link
          href="/candidates"
          className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-150"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border-light)]">
        {candidates.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--text-tertiary)]">
            No candidates added yet.
          </div>
        ) : (
          candidates.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/candidates/${candidate.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-surface)] transition-colors duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar placeholder */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border-light)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-primary)] uppercase">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm text-[var(--text-primary)] truncate">
                    {candidate.name}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] truncate">
                    {candidate.title}
                    {candidate.company ? ` at ${candidate.company}` : ""}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs text-[var(--text-muted)]">
                {formatDistanceToNow(new Date(candidate.created_at), {
                  addSuffix: true,
                })}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
