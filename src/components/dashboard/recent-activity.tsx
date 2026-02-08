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
        "flex flex-col border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--mono-border,#333333)] px-5 py-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Recent Searches
          </h3>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-1 text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white transition-colors duration-150"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--mono-border,#333333)]">
        {searches.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))]">
            No recent searches yet.
          </div>
        ) : (
          searches.map((search) => (
            <Link
              key={search.id}
              href={`/search?q=${encodeURIComponent(search.query)}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors duration-150"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm text-white truncate">
                  {search.query}
                </span>
                <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                  {search.results_count} result{search.results_count !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="shrink-0 text-xs text-[var(--mono-faint,rgba(255,255,255,0.4))]">
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
        "flex flex-col border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--mono-border,#333333)] px-5 py-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Recent Candidates
          </h3>
        </div>
        <Link
          href="/candidates"
          className="flex items-center gap-1 text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white transition-colors duration-150"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--mono-border,#333333)]">
        {candidates.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))]">
            No candidates added yet.
          </div>
        ) : (
          candidates.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/candidates/${candidate.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar placeholder */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--mono-border,#333333)] bg-white/5 text-xs font-bold text-white uppercase">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm text-white truncate">
                    {candidate.name}
                  </span>
                  <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))] truncate">
                    {candidate.title}
                    {candidate.company ? ` at ${candidate.company}` : ""}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs text-[var(--mono-faint,rgba(255,255,255,0.4))]">
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
