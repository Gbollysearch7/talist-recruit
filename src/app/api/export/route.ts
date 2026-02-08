import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

// ─── POST /api/export ───────────────────────────────────────────────────────
// Export candidates as CSV or JSON.
//
// Body:
//   type         – "csv" | "json"
//   filters?     – { search?, stage? }
//   candidateIds? – explicit list of candidate IDs to export

interface ExportBody {
  type: "csv" | "json";
  filters?: {
    search?: string;
    stage?: string;
  };
  candidateIds?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ExportBody = await request.json();

    if (!body.type || !["csv", "json"].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be "csv" or "json"' },
        { status: 400 },
      );
    }

    // ── Build query ────────────────────────────────────────────────────
    let query = supabase
      .from("candidates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Explicit candidate IDs take priority
    if (body.candidateIds && body.candidateIds.length > 0) {
      query = query.in("id", body.candidateIds);
    } else if (body.filters) {
      if (body.filters.search) {
        const s = body.filters.search;
        query = query.or(
          `name.ilike.%${s}%,title.ilike.%${s}%,company.ilike.%${s}%`,
        );
      }

      if (body.filters.stage) {
        const { data: pipelineCandidates } = await supabase
          .from("pipeline_candidates")
          .select("candidate_id")
          .eq("stage_id", body.filters.stage)
          .eq("user_id", user.id);

        const ids =
          pipelineCandidates?.map((pc) => pc.candidate_id) ?? [];

        if (ids.length === 0) {
          // No candidates in this stage — return empty export
          return respondWithExport(body.type, [], user.id, supabase);
        }

        query = query.in("id", ids);
      }
    }

    const { data: candidates, error } = await query;

    if (error) {
      console.error("Export query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch candidates for export" },
        { status: 500 },
      );
    }

    return respondWithExport(
      body.type,
      candidates ?? [],
      user.id,
      supabase,
      body.filters as Json,
    );
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

interface CandidateRow {
  id: string;
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
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function respondWithExport(
  type: "csv" | "json",
  candidates: CandidateRow[],
  userId: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  filters?: Json,
) {
  // Log the export
  await supabase.from("exports").insert({
    user_id: userId,
    type,
    filters: filters ?? null,
    row_count: candidates.length,
  });

  if (type === "json") {
    const jsonContent = JSON.stringify(candidates, null, 2);
    return new NextResponse(jsonContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="candidates-export.json"`,
      },
    });
  }

  // CSV export
  const csvHeaders = [
    "id",
    "name",
    "title",
    "company",
    "location",
    "linkedin_url",
    "email",
    "phone",
    "skills",
    "experience_years",
    "summary",
    "source",
    "created_at",
  ];

  const csvRows = candidates.map((c) =>
    csvHeaders
      .map((header) => {
        const value = c[header as keyof CandidateRow];
        if (value === null || value === undefined) return "";
        if (Array.isArray(value)) return `"${value.join(", ")}"`;
        const str = String(value);
        // Escape double quotes and wrap in quotes if the value contains commas or quotes
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(","),
  );

  const csv = [csvHeaders.join(","), ...csvRows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="candidates-export.csv"`,
    },
  });
}
