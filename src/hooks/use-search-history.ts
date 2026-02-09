"use client";

import { useQuery } from "@tanstack/react-query";
import { isToday, isAfter, subDays } from "date-fns";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: Record<string, unknown> | null;
  results_count: number | null;
  created_at: string;
}

export interface GroupedSearchHistory {
  today: SearchHistoryItem[];
  previous7Days: SearchHistoryItem[];
  previous30Days: SearchHistoryItem[];
  older: SearchHistoryItem[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function groupSearchesByTime(
  searches: SearchHistoryItem[],
): GroupedSearchHistory {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);

  return {
    today: searches.filter((s) => isToday(new Date(s.created_at))),
    previous7Days: searches.filter((s) => {
      const d = new Date(s.created_at);
      return !isToday(d) && isAfter(d, sevenDaysAgo);
    }),
    previous30Days: searches.filter((s) => {
      const d = new Date(s.created_at);
      return !isAfter(d, sevenDaysAgo) && isAfter(d, thirtyDaysAgo);
    }),
    older: searches.filter(
      (s) => !isAfter(new Date(s.created_at), thirtyDaysAgo),
    ),
  };
}

// ─── Query Key ──────────────────────────────────────────────────────────────

const SEARCH_HISTORY_KEY = ["search-history"] as const;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSearchHistory() {
  const { data, isLoading } = useQuery<SearchHistoryItem[]>({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/search-history");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch search history: ${response.statusText}`,
        );
      }
      return response.json();
    },
    staleTime: 60 * 1000,
  });

  const searches = data ?? [];
  const grouped = groupSearchesByTime(searches);

  return {
    searches,
    grouped,
    totalCount: searches.length,
    isLoading,
  };
}
