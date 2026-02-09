"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types (standalone compilation) ─────────────────────────────────────────

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  query: string;
  filters: Record<string, unknown> | null;
  created_at: string;
}

interface SaveSearchInput {
  name: string;
  query: string;
  filters?: Record<string, unknown> | null;
}

// ─── Query Keys ─────────────────────────────────────────────────────────────

const SAVED_SEARCHES_KEY = ["saved-searches"] as const;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSavedSearches() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<SavedSearch[]>({
    queryKey: SAVED_SEARCHES_KEY,
    queryFn: async () => {
      const response = await fetch("/api/saved-searches");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch saved searches: ${response.statusText}`
        );
      }
      const json = await response.json();
      return json.savedSearches ?? json ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: SaveSearchInput): Promise<SavedSearch> => {
      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to save search: ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_SEARCHES_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete saved search: ${response.statusText}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_SEARCHES_KEY });
    },
  });

  return {
    savedSearches: data ?? [],
    isLoading,
    saveSearch: saveMutation.mutate,
    deleteSearch: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
