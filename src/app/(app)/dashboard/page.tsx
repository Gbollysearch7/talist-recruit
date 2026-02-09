"use client";

import Link from "next/link";
import {
  Users,
  Search,
  Kanban,
  Bookmark,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentSearches, RecentCandidates } from "@/components/dashboard/recent-activity";

// ─── Loading skeleton ───────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded border border-[var(--border-light)] bg-[var(--bg-elevated)] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded bg-white/5" />
        <div className="h-4 w-12 bg-white/5" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-7 w-20 bg-white/5" />
        <div className="h-3 w-28 bg-white/5" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col rounded border border-[var(--border-light)] bg-[var(--bg-elevated)]">
      <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
        <div className="h-4 w-32 bg-white/5 animate-pulse" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-3 last:border-b-0"
        >
          <div className="flex flex-col gap-1">
            <div className="h-4 w-40 bg-white/5 animate-pulse" />
            <div className="h-3 w-24 bg-white/5 animate-pulse" />
          </div>
          <div className="h-3 w-16 bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard page ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { stats, isLoading } = useStats();

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">
            Here is what is happening with your recruitment pipeline.
          </p>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <Link
            href="/search"
            className="btn btn-primary gap-1.5 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            New Search
          </Link>
          <Link
            href="/pipeline"
            className="btn btn-secondary gap-1.5 px-4 py-2"
          >
            <Kanban className="h-4 w-4" />
            View Pipeline
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Candidates"
            value={stats?.totalCandidates ?? 0}
            change={12.5}
            variant="candidates"
            href="/candidates"
          />
          <StatCard
            icon={Search}
            label="Searches Today"
            value={stats?.searchesToday ?? 0}
            change={8.2}
            variant="searches"
            href="/search"
          />
          <StatCard
            icon={Kanban}
            label="Pipeline Active"
            value={stats?.pipelineActive ?? 0}
            change={-3.1}
            variant="pipeline"
            href="/pipeline"
          />
          <StatCard
            icon={Bookmark}
            label="Saved Searches"
            value={stats?.savedSearches ?? 0}
            change={15.0}
            variant="saved"
            href="/saved-searches"
          />
        </div>
      )}

      {/* Recent activity: searches + candidates side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isLoading ? (
          <>
            <ListSkeleton />
            <ListSkeleton />
          </>
        ) : (
          <>
            <RecentSearches searches={stats?.recentSearches ?? []} />
            <RecentCandidates candidates={stats?.recentCandidates ?? []} />
          </>
        )}
      </div>

      {/* Pipeline breakdown (quick glance) */}
      {!isLoading && stats?.pipelineBreakdown && stats.pipelineBreakdown.length > 0 && (
        <div className="flex flex-col rounded border border-[var(--border-light)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
            <div className="flex items-center gap-2">
              <Kanban className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Pipeline Overview
              </h3>
            </div>
            <Link
              href="/pipeline"
              className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              Open pipeline
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 p-5">
            {stats.pipelineBreakdown.map((stage) => (
              <Link
                key={stage.stageId}
                href="/pipeline"
                className="flex items-center gap-3 rounded border border-[var(--border-light)] px-4 py-3 min-w-[140px] hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)] transition-all duration-150"
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: stage.stageColor || "#666" }}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                    {stage.stageName}
                  </span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    {stage.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
