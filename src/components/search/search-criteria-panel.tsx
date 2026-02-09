"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SearchCriteriaPanelProps {
  query: string;
  enrichments: Record<string, boolean>;
  onToggleEnrichment: (key: string) => void;
  onFindMore?: () => void;
}

const ENRICHMENT_OPTIONS = [
  { key: "email", label: "Email", icon: "mail" },
  { key: "interests", label: "Interests", icon: "interests" },
  { key: "seniority", label: "Seniority", icon: "trending_up" },
  { key: "skills", label: "Skills", icon: "psychology" },
];

const criteriaColors = [
  "bg-purple-500",
  "bg-orange-500",
  "bg-blue-500",
  "bg-slate-300",
];

function parseQueryToCriteria(query: string) {
  const criteria: { text: string; color: string }[] = [];

  const roleWords: string[] = [];
  const locationWords: string[] = [];
  const companyWords: string[] = [];
  const otherWords: string[] = [];

  const locationPreps = ["in", "at", "from", "near", "based"];
  const roleKeywords =
    /engineer|developer|manager|director|designer|analyst|lead|head|vp|cto|ceo|founder|consultant|product|marketing|senior|junior|principal|staff|recruiter|researcher|scientist|architect|strategist/i;
  const companyKeywords =
    /google|meta|facebook|amazon|apple|netflix|microsoft|faang|startup|fintech/i;

  const words = query.split(/\s+/);
  let inLocation = false;
  let inCompany = false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const lower = word.toLowerCase();

    if (locationPreps.includes(lower) && i + 1 < words.length) {
      inLocation = true;
      inCompany = false;
      continue;
    }

    if (lower === "at" && i + 1 < words.length) {
      inCompany = true;
      inLocation = false;
      continue;
    }

    if (inLocation) {
      locationWords.push(word);
    } else if (inCompany || companyKeywords.test(word)) {
      companyWords.push(word);
      inCompany = false;
    } else if (
      roleKeywords.test(word) ||
      /^\d+$/.test(word) ||
      lower === "with" ||
      lower === "years" ||
      lower === "experience"
    ) {
      roleWords.push(word);
    } else {
      otherWords.push(word);
    }
  }

  const roleText = [...roleWords, ...otherWords].join(" ").trim();
  if (roleText) {
    criteria.push({
      text: `Role matches: ${roleText}`,
      color: criteriaColors[0],
    });
  }

  if (locationWords.length > 0) {
    criteria.push({
      text: `Located in: ${locationWords.join(" ")}`,
      color: criteriaColors[1],
    });
  }

  if (companyWords.length > 0) {
    criteria.push({
      text: `Company: ${companyWords.join(" ")} or similar`,
      color: criteriaColors[2],
    });
  }

  criteria.push({
    text: "Must have verifiable professional profile",
    color: criteriaColors[3],
  });

  return criteria;
}

export function SearchCriteriaPanel({
  query,
  enrichments,
  onToggleEnrichment,
  onFindMore,
}: SearchCriteriaPanelProps) {
  const [activeTab, setActiveTab] = React.useState<"criteria" | "details">(
    "criteria"
  );
  const criteria = parseQueryToCriteria(query);
  const activeEnrichmentCount = Object.values(enrichments).filter(Boolean).length;

  return (
    <div className="flex flex-col border border-[var(--border-light)] bg-[var(--bg-secondary)] h-full w-80 rounded-r">
      {/* Tab Headers */}
      <div className="flex border-b border-[var(--border-light)]">
        <button
          onClick={() => setActiveTab("criteria")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-medium transition-colors",
            activeTab === "criteria"
              ? "text-[var(--text-primary)] border-b-2 border-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          )}
        >
          Criteria
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-medium transition-colors",
            activeTab === "details"
              ? "text-[var(--text-primary)] border-b-2 border-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          )}
        >
          Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "criteria" ? (
          <>
            {/* Criteria header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Criteria
              </span>
              <button className="btn btn-ghost text-[10px]">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  group
                </span>
                People
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                  expand_more
                </span>
              </button>
            </div>

            {/* Query highlight box */}
            <div className="rounded border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                &ldquo;{query}&rdquo;
              </p>
            </div>

            {/* Criteria list with colored dots */}
            <div className="space-y-2">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "criteria-dot mt-1 shrink-0",
                      c.color
                    )}
                  />
                  <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {c.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action links */}
            <div className="space-y-1 pt-2">
              <button className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  add
                </span>
                Add Criteria
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  person_off
                </span>
                Exclude People
              </button>
            </div>
          </>
        ) : (
          /* Details Tab */
          <div className="space-y-3">
            <div className="rounded border border-[var(--border-light)] bg-[var(--bg-surface)] p-3">
              <p className="text-xs text-[var(--text-tertiary)]">
                Search details and insights will appear here after results are
                loaded.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enrichments Section */}
      <div className="border-t border-[var(--border-light)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Enrichments
          </h4>
          <button className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              settings
            </span>
            {activeEnrichmentCount > 0 && (
              <span className="px-1 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] text-[9px] font-bold">
                {activeEnrichmentCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ENRICHMENT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onToggleEnrichment(option.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs rounded border transition-colors duration-150",
                enrichments[option.key]
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border-light)] text-[var(--text-tertiary)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)]"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-2 text-xs rounded border border-dashed border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-colors duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            add
          </span>
          Custom
        </button>
      </div>

      {/* Footer link */}
      <div className="border-t border-[var(--border-light)] px-4 py-2">
        <button
          onClick={onFindMore}
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline w-full justify-center"
        >
          Find more results
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
