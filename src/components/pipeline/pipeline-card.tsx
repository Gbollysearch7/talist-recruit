"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, User } from "lucide-react";

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

interface StageOption {
  id: string;
  name: string;
  color: string | null;
}

interface PipelineCardProps {
  pipelineCandidate: PipelineCandidate;
  stageColor: string | null;
  stages: StageOption[];
  currentStageId: string;
  onMove: (candidateId: string, fromStageId: string, toStageId: string) => void;
  onClick: (candidate: PipelineCandidate) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PipelineCard({
  pipelineCandidate,
  stageColor,
  stages,
  currentStageId,
  onMove,
  onClick,
}: PipelineCardProps) {
  const [showMoveMenu, setShowMoveMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const candidate = pipelineCandidate.candidate;

  // Close menu on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMoveMenu(false);
      }
    }
    if (showMoveMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoveMenu]);

  const otherStages = stages.filter((s) => s.id !== currentStageId);

  function handleMoveClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowMoveMenu(!showMoveMenu);
  }

  function handleSelectStage(targetStageId: string) {
    onMove(pipelineCandidate.candidate_id, currentStageId, targetStageId);
    setShowMoveMenu(false);
  }

  const initials = candidate
    ? candidate.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div
      className={cn(
        "relative border border-[#333] bg-[#121212] p-3 transition-colors hover:bg-white/[0.03] cursor-pointer group"
      )}
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: stageColor ?? "#555",
      }}
      onClick={() => onClick(pipelineCandidate)}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#333] bg-white/5 text-xs font-medium text-white">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {candidate?.name ?? "Unknown Candidate"}
          </p>
          {candidate?.title && (
            <p className="truncate text-xs text-[rgba(255,255,255,0.6)] mt-0.5">
              {candidate.title}
            </p>
          )}
          {candidate?.company && (
            <p className="truncate text-xs text-[rgba(255,255,255,0.5)] mt-0.5">
              {candidate.company}
            </p>
          )}
        </div>
      </div>

      {/* Move Button */}
      <div className="relative mt-2" ref={menuRef}>
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          onClick={handleMoveClick}
        >
          <ArrowRightLeft className="h-3 w-3" />
          Move
        </button>

        {/* Move Dropdown */}
        {showMoveMenu && otherStages.length > 0 && (
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] border border-[#333] bg-[#1a1a1a] shadow-xl">
            <div className="p-1">
              <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-[rgba(255,255,255,0.4)]">
                Move to
              </p>
              {otherStages.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-xs text-[rgba(255,255,255,0.8)] hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectStage(stage.id);
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stage.color ?? "#555" }}
                  />
                  {stage.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
