"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PipelineCard } from "@/components/pipeline/pipeline-card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  skills: string[];
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

interface PipelineBoardProps {
  stages: PipelineStage[];
  onMoveCandidate: (
    candidateId: string,
    fromStageId: string,
    toStageId: string
  ) => void;
  onDeleteStage: (stageId: string) => void;
  onAddStage: () => void;
  onCardClick: (pipelineCandidate: PipelineCandidate) => void;
}

// ─── Stage Column Menu ──────────────────────────────────────────────────────

function StageMenu({
  stageId,
  onDelete,
}: {
  stageId: string;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-1 text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-label="Stage options"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-[#333] bg-[#1a1a1a] shadow-xl">
          <div className="p-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              onClick={() => {
                if (confirm("Delete this stage? Candidates will not be deleted.")) {
                  onDelete(stageId);
                }
                setOpen(false);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Stage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stage Column ───────────────────────────────────────────────────────────

function StageColumn({
  stage,
  allStages,
  onMoveCandidate,
  onDeleteStage,
  onCardClick,
}: {
  stage: PipelineStage;
  allStages: PipelineStage[];
  onMoveCandidate: (
    candidateId: string,
    fromStageId: string,
    toStageId: string
  ) => void;
  onDeleteStage: (stageId: string) => void;
  onCardClick: (pipelineCandidate: PipelineCandidate) => void;
}) {
  const candidateCount = stage.candidates?.length ?? 0;
  const stageOptions = allStages.map((s) => ({
    id: s.id,
    name: s.name,
    color: s.color,
  }));

  return (
    <div className="flex w-[300px] shrink-0 flex-col border border-[#333] bg-white/[0.01]">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-[#333] px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: stage.color ?? "#555" }}
          />
          <h3 className="text-sm font-medium text-white">{stage.name}</h3>
          <span className="inline-flex h-5 min-w-5 items-center justify-center bg-white/10 px-1.5 text-[10px] font-medium text-[rgba(255,255,255,0.6)]">
            {candidateCount}
          </span>
        </div>
        <StageMenu stageId={stage.id} onDelete={onDeleteStage} />
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-[200px]">
        {stage.candidates && stage.candidates.length > 0 ? (
          stage.candidates.map((pc) => (
            <PipelineCard
              key={pc.id}
              pipelineCandidate={pc}
              stageColor={stage.color}
              stages={stageOptions}
              currentStageId={stage.id}
              onMove={onMoveCandidate}
              onClick={onCardClick}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-[rgba(255,255,255,0.3)]">
              No candidates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Board Component ────────────────────────────────────────────────────────

export function PipelineBoard({
  stages,
  onMoveCandidate,
  onDeleteStage,
  onAddStage,
  onCardClick,
}: PipelineBoardProps) {
  const sortedStages = React.useMemo(
    () => [...stages].sort((a, b) => a.position - b.position),
    [stages]
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sortedStages.map((stage) => (
        <StageColumn
          key={stage.id}
          stage={stage}
          allStages={sortedStages}
          onMoveCandidate={onMoveCandidate}
          onDeleteStage={onDeleteStage}
          onCardClick={onCardClick}
        />
      ))}

      {/* Add Stage Button */}
      <div className="flex w-[300px] shrink-0 items-start">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 border border-dashed border-[#333] px-4 py-8 text-sm text-[rgba(255,255,255,0.4)] hover:border-white/30 hover:text-[rgba(255,255,255,0.7)] transition-colors cursor-pointer"
          onClick={onAddStage}
        >
          <Plus className="h-4 w-4" />
          Add Stage
        </button>
      </div>
    </div>
  );
}
