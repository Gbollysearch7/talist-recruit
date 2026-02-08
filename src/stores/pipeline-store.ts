import { create } from "zustand";
import type { PipelineStage, PipelineCandidate } from "@/types/database";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PipelineStageWithCandidates extends PipelineStage {
  candidates?: PipelineCandidate[];
}

interface PipelineState {
  stages: PipelineStageWithCandidates[];
  activeStageId: string | null;
}

interface PipelineActions {
  setStages: (stages: PipelineStageWithCandidates[]) => void;
  setActiveStage: (stageId: string | null) => void;
  moveCandidate: (
    candidateId: string,
    fromStageId: string,
    toStageId: string
  ) => void;
}

export type PipelineStore = PipelineState & PipelineActions;

// ─── Store ──────────────────────────────────────────────────────────────────

export const usePipelineStore = create<PipelineStore>((set) => ({
  // State
  stages: [],
  activeStageId: null,

  // Actions
  setStages: (stages) => set({ stages }),

  setActiveStage: (stageId) => set({ activeStageId: stageId }),

  moveCandidate: (candidateId, fromStageId, toStageId) =>
    set((state) => {
      const stages = state.stages.map((stage) => {
        // Remove candidate from source stage
        if (stage.id === fromStageId) {
          return {
            ...stage,
            candidates: (stage.candidates ?? []).filter(
              (c) => c.candidate_id !== candidateId
            ),
          };
        }

        // Add candidate to destination stage
        if (stage.id === toStageId) {
          const sourceStage = state.stages.find((s) => s.id === fromStageId);
          const candidate = sourceStage?.candidates?.find(
            (c) => c.candidate_id === candidateId
          );

          if (!candidate) return stage;

          return {
            ...stage,
            candidates: [
              ...(stage.candidates ?? []),
              { ...candidate, stage_id: toStageId, moved_at: new Date().toISOString() },
            ],
          };
        }

        return stage;
      });

      return { stages };
    }),
}));
