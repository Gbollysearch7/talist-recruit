import { create } from "zustand";
import type { Candidate } from "@/types/database";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SearchFilters {
  numResults?: number;
  location?: string;
  title?: string;
  company?: string;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  excludeSearchIds?: string[];
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Candidate[];
  isSearching: boolean;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setResults: (results: Candidate[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  clearResults: () => void;
}

export type SearchStore = SearchState & SearchActions;

// ─── Store ──────────────────────────────────────────────────────────────────

export const useSearchStore = create<SearchStore>((set) => ({
  // State
  query: "",
  filters: {},
  results: [],
  isSearching: false,

  // Actions
  setQuery: (query) => set({ query }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setResults: (results) => set({ results }),

  setIsSearching: (isSearching) => set({ isSearching }),

  clearResults: () => set({ results: [], isSearching: false }),
}));
