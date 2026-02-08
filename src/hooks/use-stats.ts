"use client";

import { useQuery } from "@tanstack/react-query";

// ─── Types (standalone compilation) ─────────────────────────────────────────

export interface DashboardStats {
  totalCandidates: number;
  searchesToday: number;
  pipelineActive: number;
  savedSearches: number;
  totalSearches: number;
  totalSavedSearches: number;
  pipelineBreakdown: PipelineBreakdownItem[];
  recentActivity: RecentActivityItem[];
  recentSearches: RecentSearchItem[];
  recentCandidates: RecentCandidateItem[];
}

export interface PipelineBreakdownItem {
  stageId: string;
  stageName: string;
  stageColor: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface RecentSearchItem {
  id: string;
  query: string;
  results_count: number;
  created_at: string;
}

export interface RecentCandidateItem {
  id: string;
  name: string;
  title: string;
  company: string;
  created_at: string;
}

// ─── Query Keys ─────────────────────────────────────────────────────────────

const STATS_KEY = ["stats"] as const;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useStats() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: STATS_KEY,
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 30 * 1000,
  });

  return {
    stats: data ?? null,
    isLoading,
  };
}
