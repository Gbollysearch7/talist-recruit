"use client";

import * as React from "react";
import { Bookmark, ExternalLink, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/database";

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_VISIBLE_SKILLS = 5;

// ─── Types ─────────────────────────────────────────────────────────────────

interface CandidateCardProps {
  candidate: Candidate;
  onSave: (candidate: Candidate) => void;
  isSaving?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function CandidateCard({
  candidate,
  onSave,
  isSaving = false,
  className,
}: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const visibleSkills = candidate.skills.slice(0, MAX_VISIBLE_SKILLS);
  const remainingCount = Math.max(
    0,
    candidate.skills.length - MAX_VISIBLE_SKILLS
  );

  const titleCompany = [candidate.title, candidate.company]
    .filter(Boolean)
    .join(" @ ");

  return (
    <div
      className={cn(
        "group flex flex-col border border-[#333] bg-[#121212] p-5 transition-all duration-150",
        "hover:border-white/60 hover:bg-white/[0.02]",
        className
      )}
    >
      {/* Header: Avatar + Name + Title */}
      <div className="flex items-start gap-3">
        {/* Avatar placeholder */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#333] bg-white/5 text-sm font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white">
            {candidate.name}
          </h3>
          {titleCompany && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[rgba(255,255,255,0.6)]">
              <Briefcase className="h-3 w-3 shrink-0" />
              <span className="truncate">{titleCompany}</span>
            </p>
          )}
          {candidate.location && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[rgba(255,255,255,0.6)]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{candidate.location}</span>
            </p>
          )}
        </div>
      </div>

      {/* Skills badges */}
      {candidate.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center border border-[#333] bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
            >
              {skill}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center border border-[#333] bg-white/5 px-2 py-0.5 text-[11px] text-white/40">
              +{remainingCount} more
            </span>
          )}
        </div>
      )}

      {/* Summary */}
      {candidate.summary && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[rgba(255,255,255,0.6)]">
          {candidate.summary}
        </p>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => onSave(candidate)}
          disabled={isSaving}
          className={cn(
            "inline-flex h-8 flex-1 items-center justify-center gap-1.5 border px-3 text-xs font-medium transition-colors duration-150",
            "bg-white text-[#121212] border-white hover:bg-white/90 active:bg-white/80",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            "disabled:pointer-events-none disabled:opacity-50",
            "cursor-pointer select-none"
          )}
        >
          <Bookmark className="h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </button>

        {candidate.linkedin_url && (
          <a
            href={candidate.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 border px-3 text-xs font-medium transition-colors duration-150",
              "bg-transparent text-white border-[#333] hover:bg-white/5 active:bg-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Profile
          </a>
        )}
      </div>
    </div>
  );
}
