"use client";

import * as React from "react";
import { useCandidates } from "@/hooks/use-candidates";
import { usePipeline } from "@/hooks/use-pipeline";
import { useExport } from "@/hooks/use-export";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { CandidateDetail } from "@/components/candidates/candidate-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  Trash2,
  ArrowRightLeft,
  Filter,
  Loader2,
  Users,
} from "lucide-react";
import type { RowSelectionState } from "@tanstack/react-table";

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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [selectedCandidate, setSelectedCandidate] =
    React.useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [locationFilter, setLocationFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("");
  const [moveStageId, setMoveStageId] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { candidates, total, isLoading, deleteCandidate } = useCandidates({
    search: debouncedSearch,
  });
  const { stages, moveCandidate } = usePipeline();
  const { exportCandidates, isExporting } = useExport();

  // Filter candidates locally for additional filters
  const filteredCandidates = React.useMemo(() => {
    let result = candidates;
    if (locationFilter) {
      result = result.filter(
        (c: Candidate) =>
          c.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (sourceFilter) {
      result = result.filter(
        (c: Candidate) => c.source === sourceFilter
      );
    }
    return result;
  }, [candidates, locationFilter, sourceFilter]);

  // Get unique sources for filter
  const uniqueSources = React.useMemo(() => {
    const sources = new Set(
      candidates
        .map((c: Candidate) => c.source)
        .filter(Boolean) as string[]
    );
    return Array.from(sources).map((s) => ({ value: s, label: s }));
  }, [candidates]);

  // Selected candidate IDs
  const selectedIds = React.useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => filteredCandidates[Number(index)]?.id)
      .filter(Boolean) as string[];
  }, [rowSelection, filteredCandidates]);

  function handleView(candidate: Candidate) {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this candidate?")) {
      deleteCandidate(id);
    }
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedIds.length} candidate(s)?`
      )
    ) {
      selectedIds.forEach((id) => deleteCandidate(id));
      setRowSelection({});
    }
  }

  function handleBulkExport() {
    if (selectedIds.length === 0) return;
    exportCandidates({ type: "csv", candidateIds: selectedIds });
  }

  function handleExportAll() {
    exportCandidates({ type: "csv" });
  }

  function handleBulkMoveToStage() {
    if (selectedIds.length === 0 || !moveStageId) return;
    selectedIds.forEach((id) => {
      moveCandidate({
        candidateId: id,
        fromStageId: "",
        toStageId: moveStageId,
      });
    });
    setRowSelection({});
    setMoveStageId("");
  }

  function handleMoveToStage(candidateId: string, stageId: string) {
    moveCandidate({
      candidateId,
      fromStageId: "",
      toStageId: stageId,
    });
  }

  function handleExportSingle(candidateId: string) {
    exportCandidates({ type: "csv", candidateIds: [candidateId] });
  }

  const stageOptions = stages.map((s: { id: string; name: string }) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Candidates</h1>
          <Badge variant="outline" className="tabular-nums">
            {total}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            loading={isExporting}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(255,255,255,0.6)]" />
          <input
            type="text"
            placeholder="Search candidates by name, title, company, skills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setGlobalFilter(e.target.value);
            }}
            className="flex h-10 w-full bg-[#121212] pl-10 pr-3 py-2 text-sm text-white border border-[#333] placeholder:text-[rgba(255,255,255,0.6)] focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-colors duration-150"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-end gap-3 border border-[#333] bg-white/[0.02] p-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Location"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            {uniqueSources.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <Select
                  label="Source"
                  options={[{ value: "", label: "All Sources" }, ...uniqueSources]}
                  value={sourceFilter}
                  onChange={(value) => setSourceFilter(value)}
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocationFilter("");
                setSourceFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border border-[#333] bg-white/[0.03] px-4 py-3">
          <span className="text-sm text-[rgba(255,255,255,0.6)]">
            {selectedIds.length} selected
          </span>
          <div className="h-4 w-px bg-[#333]" />
          <Button variant="outline" size="sm" onClick={handleBulkExport}>
            <Download className="h-4 w-4" />
            Export Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
          <div className="flex items-center gap-2">
            <Select
              options={stageOptions}
              value={moveStageId}
              onChange={(value) => setMoveStageId(value)}
              placeholder="Move to stage..."
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMoveToStage}
              disabled={!moveStageId}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Move
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[rgba(255,255,255,0.6)]" />
        </div>
      ) : (
        <CandidatesTable
          candidates={filteredCandidates}
          onView={handleView}
          onDelete={handleDelete}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      )}

      {/* Detail Modal */}
      <CandidateDetail
        candidate={selectedCandidate}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        stages={stages}
        onMoveToStage={handleMoveToStage}
        onExport={handleExportSingle}
        onDelete={handleDelete}
      />
    </div>
  );
}
