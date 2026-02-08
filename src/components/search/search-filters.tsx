"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchFilters as SearchFiltersType } from "@/stores/search-store";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: Partial<SearchFiltersType>) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function SearchFilters({
  filters,
  onChange,
  onApply,
  onClear,
  className,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [skillInput, setSkillInput] = React.useState("");

  const hasActiveFilters =
    !!filters.location ||
    !!filters.title ||
    !!filters.company ||
    (filters.skills && filters.skills.length > 0) ||
    filters.experienceMin !== undefined ||
    filters.experienceMax !== undefined;

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
    if (
      e.key === "Backspace" &&
      !skillInput &&
      filters.skills &&
      filters.skills.length > 0
    ) {
      const newSkills = filters.skills.slice(0, -1);
      onChange({ skills: newSkills.length > 0 ? newSkills : undefined });
    }
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill) return;
    const current = filters.skills ?? [];
    if (!current.includes(skill)) {
      onChange({ skills: [...current, skill] });
    }
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    const newSkills = (filters.skills ?? []).filter((s) => s !== skillToRemove);
    onChange({ skills: newSkills.length > 0 ? newSkills : undefined });
  }

  function handleClear() {
    setSkillInput("");
    onClear();
  }

  return (
    <div
      className={cn(
        "border border-[#333] bg-[#121212] transition-all duration-200",
        className
      )}
    >
      {/* Collapse toggle header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-white transition-colors",
          "hover:bg-white/5 cursor-pointer select-none"
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/60" />
          Filters
          {hasActiveFilters && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center bg-white px-1.5 text-xs font-bold text-[#121212]">
              {[
                filters.location,
                filters.title,
                filters.company,
                filters.skills?.length,
                filters.experienceMin !== undefined ||
                filters.experienceMax !== undefined
                  ? 1
                  : 0,
              ].filter(Boolean).length}
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>

      {/* Filter fields */}
      {isExpanded && (
        <div className="border-t border-[#333] px-4 pb-4 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Location
              </label>
              <input
                type="text"
                value={filters.location ?? ""}
                onChange={(e) =>
                  onChange({
                    location: e.target.value || undefined,
                  })
                }
                placeholder="e.g. San Francisco, CA"
                className={cn(
                  "h-10 w-full border border-[#333] bg-[#121212] px-3 text-sm text-white",
                  "placeholder:text-white/30",
                  "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30",
                  "transition-colors duration-150"
                )}
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Title
              </label>
              <input
                type="text"
                value={filters.title ?? ""}
                onChange={(e) =>
                  onChange({
                    title: e.target.value || undefined,
                  })
                }
                placeholder="e.g. Senior Engineer"
                className={cn(
                  "h-10 w-full border border-[#333] bg-[#121212] px-3 text-sm text-white",
                  "placeholder:text-white/30",
                  "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30",
                  "transition-colors duration-150"
                )}
              />
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Company
              </label>
              <input
                type="text"
                value={filters.company ?? ""}
                onChange={(e) =>
                  onChange({
                    company: e.target.value || undefined,
                  })
                }
                placeholder="e.g. Google, Meta"
                className={cn(
                  "h-10 w-full border border-[#333] bg-[#121212] px-3 text-sm text-white",
                  "placeholder:text-white/30",
                  "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30",
                  "transition-colors duration-150"
                )}
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Skills
              </label>
              <div
                className={cn(
                  "flex min-h-10 flex-wrap items-center gap-1.5 border border-[#333] bg-[#121212] px-3 py-1.5",
                  "focus-within:border-white focus-within:ring-1 focus-within:ring-white/30",
                  "transition-colors duration-150"
                )}
              >
                {(filters.skills ?? []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 border border-[#333] bg-white/5 px-2 py-0.5 text-xs text-white"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-white/40 transition-colors hover:text-white"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={addSkill}
                  placeholder={
                    (filters.skills ?? []).length === 0
                      ? "Type a skill and press Enter..."
                      : "Add more..."
                  }
                  className="min-w-[120px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>
              <p className="text-xs text-white/30">
                Press Enter or comma to add a skill
              </p>
            </div>

            {/* Experience Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Experience (years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={filters.experienceMin ?? ""}
                  onChange={(e) =>
                    onChange({
                      experienceMin: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Min"
                  className={cn(
                    "h-10 w-full border border-[#333] bg-[#121212] px-3 text-sm text-white",
                    "placeholder:text-white/30",
                    "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30",
                    "transition-colors duration-150"
                  )}
                />
                <span className="shrink-0 text-sm text-white/30">to</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={filters.experienceMax ?? ""}
                  onChange={(e) =>
                    onChange({
                      experienceMax: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Max"
                  className={cn(
                    "h-10 w-full border border-[#333] bg-[#121212] px-3 text-sm text-white",
                    "placeholder:text-white/30",
                    "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30",
                    "transition-colors duration-150"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center gap-3 border-t border-[#333] pt-4">
            <button
              type="button"
              onClick={onApply}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-2 border px-5 text-sm font-medium transition-colors duration-150",
                "bg-white text-[#121212] border-white hover:bg-white/90 active:bg-white/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                "cursor-pointer select-none"
              )}
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-2 border px-5 text-sm font-medium transition-colors duration-150",
                "bg-transparent text-white border-[#333] hover:bg-white/5 active:bg-white/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                "disabled:pointer-events-none disabled:opacity-50",
                "cursor-pointer select-none"
              )}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
