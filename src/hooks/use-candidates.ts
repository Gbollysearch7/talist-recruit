"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

interface CandidateCreateInput {
  name: string;
  exa_id: string;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  phone?: string | null;
  skills?: string[];
  experience_years?: number | null;
  summary?: string | null;
  source?: string | null;
  raw_data?: any;
}

interface CandidateUpdateInput {
  id: string;
  data: Partial<Omit<Candidate, "id" | "user_id" | "created_at" | "updated_at">>;
}

interface CandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CandidatesResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
}

// ─── Query Keys ─────────────────────────────────────────────────────────────

const CANDIDATES_KEY = ["candidates"] as const;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useCandidates(params?: CandidatesParams) {
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.search) queryParams.set("search", params.search);

  const queryString = queryParams.toString();
  const url = `/api/candidates${queryString ? `?${queryString}` : ""}`;

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<CandidatesResponse>({
    queryKey: [...CANDIDATES_KEY, params],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch candidates: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: CandidateCreateInput): Promise<Candidate> => {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(`Failed to save candidate: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: CandidateUpdateInput): Promise<Candidate> => {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete candidate: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY });
    },
  });

  return {
    candidates: data?.candidates ?? [],
    total: data?.total ?? 0,
    isLoading,
    saveCandidate: saveMutation.mutate,
    updateCandidate: updateMutation.mutate,
    deleteCandidate: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
}
