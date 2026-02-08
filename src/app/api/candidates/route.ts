import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

// ─── GET /api/candidates ────────────────────────────────────────────────────
// List candidates with optional filters and pagination.
//
// Query params:
//   search  – free-text search against name, title, company
//   stage   – filter by pipeline stage id
//   page    – 1-based page number (default 1)
//   limit   – items per page (default 20, max 100)

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const stage = searchParams.get("stage");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
    );
    const offset = (page - 1) * limit;

    // Start query
    let query = supabase
      .from("candidates")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Free-text search across name, title, company
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,title.ilike.%${search}%,company.ilike.%${search}%`,
      );
    }

    // If a stage filter is provided, get candidate IDs from pipeline_candidates
    if (stage) {
      const { data: pipelineCandidates } = await supabase
        .from("pipeline_candidates")
        .select("candidate_id")
        .eq("stage_id", stage)
        .eq("user_id", user.id);

      const candidateIds =
        pipelineCandidates?.map((pc) => pc.candidate_id) ?? [];

      if (candidateIds.length === 0) {
        return NextResponse.json({
          candidates: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        });
      }

      query = query.in("id", candidateIds);
    }

    const { data: candidates, error, count } = await query;

    if (error) {
      console.error("Failed to fetch candidates:", error);
      return NextResponse.json(
        { error: "Failed to fetch candidates" },
        { status: 500 },
      );
    }

    const total = count ?? 0;

    return NextResponse.json({
      candidates: candidates ?? [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Candidates GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── POST /api/candidates ───────────────────────────────────────────────────
// Save a candidate (usually from search results) into the candidates table.

interface SaveCandidateBody {
  exa_id: string;
  name: string;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  phone?: string | null;
  skills?: string[];
  experience_years?: number | null;
  summary?: string | null;
  source?: string | null;
  raw_data?: Json | null;
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

    const body: SaveCandidateBody = await request.json();

    if (!body.exa_id || !body.name) {
      return NextResponse.json(
        { error: "exa_id and name are required" },
        { status: 400 },
      );
    }

    // Check for duplicate exa_id for this user
    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("user_id", user.id)
      .eq("exa_id", body.exa_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Candidate already saved", candidateId: existing.id },
        { status: 409 },
      );
    }

    const { data: candidate, error } = await supabase
      .from("candidates")
      .insert({
        user_id: user.id,
        exa_id: body.exa_id,
        name: body.name,
        title: body.title ?? null,
        company: body.company ?? null,
        location: body.location ?? null,
        linkedin_url: body.linkedin_url ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        skills: body.skills ?? [],
        experience_years: body.experience_years ?? null,
        summary: body.summary ?? null,
        source: body.source ?? null,
        raw_data: body.raw_data ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save candidate:", error);
      return NextResponse.json(
        { error: "Failed to save candidate" },
        { status: 500 },
      );
    }

    return NextResponse.json({ candidate }, { status: 201 });
  } catch (error) {
    console.error("Candidates POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
