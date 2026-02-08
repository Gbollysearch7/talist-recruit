"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePipelineStore } from "@/stores/pipeline-store";

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

interface PipelineCandidate {
  id: string;
  candidate_id: string;
  stage_id: string;
  user_id: string;
  notes: string | null;
  moved_at: string;
  created_at: string;
  candidate?: Candidate;
}

interface PipelineStage {
  id: string;
  user_id: string;
  name: string;
  position: number;
  color: string | null;
  created_at: string;
  candidates?: PipelineCandidate[];
}

interface CreateStageInput {
  name: string;
  position: number;
  color?: string;
}

interface MoveCandidateInput {
  candidateId: string;
  fromStageId: string;
  toStageId: string;
}

// ─── Query Keys ─────────────────────────────────────────────────────────────

const PIPELINE_KEY = ["pipeline"] as const;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function usePipeline() {
  const queryClient = useQueryClient();
  const { setStages, moveCandidate: moveCandidateLocal } = usePipelineStore();

  const { data, isLoading } = useQuery<PipelineStage[]>({
    queryKey: PIPELINE_KEY,
    queryFn: async () => {
      const response = await fetch("/api/pipeline");
      if (!response.ok) {
        throw new Error(`Failed to fetch pipeline: ${response.statusText}`);
      }
      const stages: PipelineStage[] = await response.json();
      setStages(stages);
      return stages;
    },
  });

  const createStageMutation = useMutation({
    mutationFn: async (input: CreateStageInput): Promise<PipelineStage> => {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(`Failed to create stage: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });

  const moveCandidateMutation = useMutation({
    mutationFn: async ({
      candidateId,
      fromStageId,
      toStageId,
    }: MoveCandidateInput): Promise<void> => {
      // Optimistic local update
      moveCandidateLocal(candidateId, fromStageId, toStageId);

      const response = await fetch("/api/pipeline/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          from_stage_id: fromStageId,
          to_stage_id: toStageId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to move candidate: ${response.statusText}`);
      }
    },
    onError: () => {
      // Revert optimistic update on failure
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });

  const deleteStageMutation = useMutation({
    mutationFn: async (stageId: string): Promise<void> => {
      const response = await fetch(`/api/pipeline/${stageId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete stage: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });

  return {
    stages: data ?? [],
    isLoading,
    createStage: createStageMutation.mutate,
    moveCandidate: moveCandidateMutation.mutate,
    deleteStage: deleteStageMutation.mutate,
    isCreatingStage: createStageMutation.isPending,
    isMovingCandidate: moveCandidateMutation.isPending,
    isDeletingStage: deleteStageMutation.isPending,
  };
}
