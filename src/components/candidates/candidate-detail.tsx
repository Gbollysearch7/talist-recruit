"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

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

interface PipelineStage {
  id: string;
  name: string;
  position: number;
  color: string | null;
}

interface CandidateDetailProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages?: PipelineStage[];
  currentStageId?: string | null;
  onMoveToStage?: (candidateId: string, stageId: string) => void;
  onExport?: (candidateId: string) => void;
  onDelete?: (candidateId: string) => void;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

function DetailAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-16 w-16 items-center justify-center border border-[#333] bg-white/5 text-xl font-semibold text-white">
      {initials}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CandidateDetail({
  candidate,
  open,
  onOpenChange,
  stages = [],
  currentStageId,
  onMoveToStage,
  onExport,
  onDelete,
}: CandidateDetailProps) {
  const [selectedStageId, setSelectedStageId] = React.useState(
    currentStageId ?? ""
  );

  React.useEffect(() => {
    setSelectedStageId(currentStageId ?? "");
  }, [currentStageId]);

  if (!candidate) return null;

  const stageOptions = stages.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  function handleMoveStage(value: string) {
    setSelectedStageId(value);
    if (value && onMoveToStage) {
      onMoveToStage(candidate!.id, value);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(85vh-48px)] pr-1">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <DetailAvatar name={candidate.name} />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl">{candidate.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  {candidate.title && (
                    <span>{candidate.title}</span>
                  )}
                  {candidate.title && candidate.company && (
                    <span> at </span>
                  )}
                  {candidate.company && (
                    <span className="text-white/80">{candidate.company}</span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {candidate.location && (
              <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{candidate.location}</span>
              </div>
            )}
            {candidate.email && (
              <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${candidate.email}`}
                  className="truncate hover:text-white transition-colors"
                >
                  {candidate.email}
                </a>
              </div>
            )}
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.linkedin_url && (
              <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                <Linkedin className="h-4 w-4 shrink-0" />
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 truncate hover:text-white transition-colors"
                >
                  LinkedIn Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {candidate.experience_years !== null && (
              <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>{candidate.experience_years} years experience</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.6)]">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Added {format(new Date(candidate.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {candidate.summary && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
                Summary
              </h4>
              <p className="text-sm leading-relaxed text-[rgba(255,255,255,0.8)]">
                {candidate.summary}
              </p>
            </div>
          )}

          {/* Pipeline Stage */}
          {stages.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
                Pipeline Stage
              </h4>
              <div className="flex items-center gap-3">
                {stages.map((stage) => {
                  const isActive = stage.id === selectedStageId;
                  return (
                    <div
                      key={stage.id}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: isActive
                            ? stage.color ?? "#fff"
                            : "rgba(255,255,255,0.15)",
                        }}
                      />
                      <span
                        className={
                          isActive
                            ? "text-white font-medium"
                            : "text-[rgba(255,255,255,0.4)]"
                        }
                      >
                        {stage.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <Select
                  options={stageOptions}
                  value={selectedStageId}
                  onChange={handleMoveStage}
                  placeholder="Move to stage..."
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
              Notes
            </h4>
            <Textarea
              placeholder="Add notes about this candidate..."
              className="min-h-[80px]"
            />
          </div>

          {/* Actions */}
          <DialogFooter className="mt-6">
            <div className="flex w-full items-center justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete?.(candidate.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport?.(candidate.id)}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
