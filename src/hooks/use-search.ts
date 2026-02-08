"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchStore } from "@/stores/search-store";
import type { SearchFilters } from "@/stores/search-store";

// ─── Types (standalone compilation) ─────────────────────────────────────────

interface Candidate {
  id: string;
  user_id: string;
  exa_id: string | null;
  name: string;
  title: string | null;
  company: string | null;
  location: string | null;
  linkedin_url: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number | null;
  summary: string | null;
  source: string | null;
  raw_data: any;
  created_at: string;
  updated_at: string;
}

interface SearchRequest {
  query: string;
  filters: SearchFilters;
}

interface SearchResponse {
  candidates: Candidate[];
  total: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSearch() {
  const {
    query,
    filters,
    results,
    isSearching,
    setQuery,
    setFilters,
    setResults,
    setIsSearching,
    clearResults,
  } = useSearchStore();

  const searchMutation = useMutation({
    mutationFn: async (request: SearchRequest): Promise<SearchResponse> => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return response.json();
    },
    onMutate: () => {
      setIsSearching(true);
    },
    onSuccess: (data) => {
      setResults(data.candidates as any);
      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false);
    },
  });

  const search = (searchQuery?: string, searchFilters?: SearchFilters) => {
    const q = searchQuery ?? query;
    const f = searchFilters ?? filters;

    if (searchQuery !== undefined) setQuery(q);
    if (searchFilters !== undefined) setFilters(f);

    searchMutation.mutate({ query: q, filters: f });
  };

  return {
    search,
    results,
    isSearching,
    query,
    filters,
    setQuery,
    setFilters,
    clearResults,
  };
}
