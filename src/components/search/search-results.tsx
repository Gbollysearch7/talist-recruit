"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/database";

interface SearchResultsProps {
  results: Candidate[];
  isSearching: boolean;
  hasSearched: boolean;
  onSaveCandidate: (candidate: Candidate) => void;
  isSaving?: boolean;
  className?: string;
  startIndex?: number;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  criteria?: string[];
}

type MatchStatus = "Match" | "Miss" | "Unclear";

function getSimulatedMatch(candidateId: string, criterionIndex: number): MatchStatus {
  const seed =
    (candidateId.charCodeAt(0) || 0) +
    (candidateId.charCodeAt(1) || 0) +
    criterionIndex;
  if (seed % 7 === 0) return "Miss";
  if (seed % 5 === 0) return "Unclear";
  return "Match";
}

function getSimulatedRefs(candidateId: string, criterionIndex: number): number {
  const seed =
    (candidateId.charCodeAt(0) || 0) +
    (candidateId.charCodeAt(1) || 0) +
    criterionIndex;
  return ((seed * 7) % 30) + 1;
}

const criteriaColors = ["bg-purple-500", "bg-orange-500", "bg-blue-500", "bg-slate-300"];

function SkeletonRow() {
  return (
    <tr>
      <td className="text-center"><div className="h-3 w-4 animate-pulse bg-[var(--bg-surface)] rounded mx-auto" /></td>
      <td className="text-center"><div className="h-3.5 w-3.5 animate-pulse bg-[var(--bg-surface)] rounded mx-auto" /></td>
      <td><div className="flex items-center gap-2"><div className="h-5 w-5 animate-pulse bg-[var(--bg-surface)] rounded" /><div className="h-3 w-24 animate-pulse bg-[var(--bg-surface)] rounded" /></div></td>
      <td><div className="h-3 w-20 animate-pulse bg-[var(--bg-surface)] rounded" /></td>
      <td><div className="h-3 w-28 animate-pulse bg-[var(--bg-surface)] rounded" /></td>
      <td><div className="h-3 w-32 animate-pulse bg-[var(--bg-surface)] rounded" /></td>
    </tr>
  );
}

export function SearchResults({
  results,
  isSearching,
  hasSearched,
  className,
  startIndex = 0,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  criteria = [],
}: SearchResultsProps) {
  const allSelected =
    results.length > 0 && selectedIds.size === results.length;

  const criteriaColumns = React.useMemo(
    () =>
      criteria.slice(0, 3).map((c, i) => ({
        id: `criteria-${i}`,
        label: c.length > 18 ? c.slice(0, 18) + "..." : c,
        fullLabel: c,
        color: criteriaColors[i] || criteriaColors[3],
      })),
    [criteria]
  );

  if (isSearching) {
    return (
      <div className={cn("overflow-auto", className)}>
        <table className="dense-table">
          <thead>
            <tr>
              <th className="w-8 text-center">#</th>
              <th className="w-8 text-center">
                <input type="checkbox" disabled className="opacity-30" />
              </th>
              <th className="w-48">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>person</span>
                  Name
                </div>
              </th>
              <th className="w-36">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>business</span>
                  Company
                </div>
              </th>
              <th className="w-44">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>work</span>
                  Job Title
                </div>
              </th>
              <th className="w-44">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>link</span>
                  URL
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16", className)}>
        <span
          className="material-symbols-outlined text-[var(--text-muted)] mb-3"
          style={{ fontSize: 48 }}
        >
          person_off
        </span>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          No candidates found
        </h3>
        <p className="mt-1 text-xs text-[var(--text-tertiary)] max-w-md text-center">
          Try adjusting your search query or removing filters.
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="dense-table">
        <thead>
          <tr>
            <th className="w-8 text-center">#</th>
            <th className="w-8 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll ?? (() => {})}
              />
            </th>
            <th className="w-48">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>person</span>
                Name
              </div>
            </th>
            <th className="w-36">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>business</span>
                Company
              </div>
            </th>
            <th className="w-44">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>work</span>
                Job Title
              </div>
            </th>
            <th className="w-44">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.5 }}>link</span>
                URL
              </div>
            </th>
            {criteriaColumns.map((col) => (
              <th key={col.id} className="min-w-[130px]">
                <div className="flex items-center gap-1.5" title={col.fullLabel}>
                  <span className={`w-2 h-2 rounded-sm ${col.color} shrink-0`} />
                  {col.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((candidate, index) => {
            const candidateKey =
              candidate.exa_id || candidate.id || String(index);
            const isSelected = selectedIds.has(candidateKey);
            const rowNum = startIndex + index + 1;

            return (
              <tr
                key={candidateKey}
                className={cn(isSelected && "bg-[var(--primary-light)]")}
              >
                <td className="text-center text-[var(--text-muted)]">{rowNum}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect?.(candidateKey)}
                  />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-[var(--text-tertiary)] bg-[var(--bg-elevated)]">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    </div>
                    <span className="font-medium truncate max-w-[160px] text-[var(--text-primary)]">
                      {candidate.name}
                    </span>
                  </div>
                </td>
                <td className="text-[var(--text-secondary)]">
                  {candidate.company || "—"}
                </td>
                <td className="text-[var(--text-tertiary)]">
                  {candidate.title || "—"}
                </td>
                <td>
                  {candidate.linkedin_url ? (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] opacity-80 hover:opacity-100 truncate block max-w-[160px]"
                    >
                      {candidate.linkedin_url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 24)}...
                    </a>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </td>
                {criteriaColumns.map((col, colIndex) => {
                  const status = getSimulatedMatch(candidateKey, colIndex);
                  const refs = getSimulatedRefs(candidateKey, colIndex);
                  return (
                    <td key={col.id}>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "match-badge",
                          status === "Match" && "match-badge-match",
                          status === "Miss" && "match-badge-miss",
                          status === "Unclear" && "match-badge-unclear"
                        )}>
                          {status}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)]">
                          {refs} ref.
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
