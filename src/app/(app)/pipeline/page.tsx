"use client";

import * as React from "react";
import { usePipeline } from "@/hooks/use-pipeline";
import { useCandidates } from "@/hooks/use-candidates";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { AddStageDialog } from "@/components/pipeline/add-stage-dialog";
import { CandidateDetail } from "@/components/candidates/candidate-detail";
import { Badge } from "@/components/ui/badge";
import { Loader2, Kanban } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

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
  raw_data: unknown;
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
  candidate?: {
    id: string;
    name: string;
    title: string | null;
    company: string | null;
    location: string | null;
    email: string | null;
    skills: string[];
  };
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const {
    stages,
    isLoading,
    createStage,
    moveCandidate,
    deleteStage,
    isCreatingStage,
  } = usePipeline();

  const { candidates } = useCandidates();

  const [addStageOpen, setAddStageOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedCandidateData, setSelectedCandidateData] =
    React.useState<Candidate | null>(null);
  const [selectedStageId, setSelectedStageId] = React.useState<string | null>(
    null
  );

  // Total candidates across all stages
  const totalCandidates = React.useMemo(
    () =>
      stages.reduce(
        (sum: number, stage: { candidates?: PipelineCandidate[] }) =>
          sum + (stage.candidates?.length ?? 0),
        0
      ),
    [stages]
  );

  // Next position for new stage
  const nextPosition = React.useMemo(
    () =>
      stages.length > 0
        ? Math.max(
            ...stages.map(
              (s: { position: number }) => s.position
            )
          ) + 1
        : 0,
    [stages]
  );

  function handleAddStage(data: {
    name: string;
    color: string;
    position: number;
  }) {
    createStage(data);
    setAddStageOpen(false);
  }

  function handleMoveCandidate(
    candidateId: string,
    fromStageId: string,
    toStageId: string
  ) {
    moveCandidate({ candidateId, fromStageId, toStageId });
  }

  function handleDeleteStage(stageId: string) {
    deleteStage(stageId);
  }

  function handleCardClick(pipelineCandidate: PipelineCandidate) {
    // Find full candidate data
    const fullCandidate = candidates.find(
      (c: Candidate) => c.id === pipelineCandidate.candidate_id
    );
    if (fullCandidate) {
      setSelectedCandidateData(fullCandidate);
      setSelectedStageId(pipelineCandidate.stage_id);
      setDetailOpen(true);
    }
  }

  function handleMoveToStage(candidateId: string, stageId: string) {
    const currentStage = stages.find(
      (s: { id: string; candidates?: PipelineCandidate[] }) =>
        s.candidates?.some(
          (c: PipelineCandidate) => c.candidate_id === candidateId
        )
    );
    if (currentStage) {
      moveCandidate({
        candidateId,
        fromStageId: currentStage.id,
        toStageId: stageId,
      });
      setSelectedStageId(stageId);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Kanban className="h-6 w-6 text-[rgba(255,255,255,0.6)]" />
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <Badge variant="outline" className="tabular-nums">
          {totalCandidates} candidate{totalCandidates !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="outline" className="tabular-nums">
          {stages.length} stage{stages.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Board */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[rgba(255,255,255,0.6)]" />
        </div>
      ) : stages.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#333] py-20">
          <Kanban className="h-12 w-12 text-[rgba(255,255,255,0.2)] mb-4" />
          <p className="text-[rgba(255,255,255,0.6)] mb-1">
            No pipeline stages yet
          </p>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">
            Create your first stage to start organizing candidates.
          </p>
          <button
            type="button"
            className="border border-[#333] px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => setAddStageOpen(true)}
          >
            Create First Stage
          </button>
        </div>
      ) : (
        <PipelineBoard
          stages={stages}
          onMoveCandidate={handleMoveCandidate}
          onDeleteStage={handleDeleteStage}
          onAddStage={() => setAddStageOpen(true)}
          onCardClick={handleCardClick}
        />
      )}

      {/* Add Stage Dialog */}
      <AddStageDialog
        open={addStageOpen}
        onOpenChange={setAddStageOpen}
        onSave={handleAddStage}
        nextPosition={nextPosition}
        isSaving={isCreatingStage}
      />

      {/* Candidate Detail */}
      <CandidateDetail
        candidate={selectedCandidateData}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        stages={stages}
        currentStageId={selectedStageId}
        onMoveToStage={handleMoveToStage}
      />
    </div>
  );
}
