"use client";

import { useMutation } from "@tanstack/react-query";

// ─── Types (standalone compilation) ─────────────────────────────────────────

interface ExportRequest {
  type: "csv" | "json" | "xlsx";
  candidateIds?: string[];
  filters?: Record<string, unknown>;
}

interface ExportResponse {
  file_url: string;
  row_count: number;
  filename: string;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useExport() {
  const exportMutation = useMutation({
    mutationFn: async (request: ExportRequest): Promise<ExportResponse> => {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Trigger file download in the browser
      const link = document.createElement("a");
      link.href = data.file_url;
      link.download = data.filename ?? "export";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });

  return {
    exportCandidates: exportMutation.mutate,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
  };
}
