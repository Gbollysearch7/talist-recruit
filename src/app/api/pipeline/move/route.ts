import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── POST /api/pipeline/move ────────────────────────────────────────────────
// Move (or add) a candidate into a pipeline stage.
//
// Body: { candidateId: string, stageId: string, notes?: string }

interface MoveBody {
  candidateId: string;
  stageId: string;
  notes?: string;
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

    const body: MoveBody = await request.json();

    if (!body.candidateId || !body.stageId) {
      return NextResponse.json(
        { error: "candidateId and stageId are required" },
        { status: 400 },
      );
    }

    // Validate that the candidate belongs to this user
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("id", body.candidateId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 },
      );
    }

    // Validate that the stage belongs to this user
    const { data: stage } = await supabase
      .from("pipeline_stages")
      .select("id")
      .eq("id", body.stageId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!stage) {
      return NextResponse.json(
        { error: "Pipeline stage not found" },
        { status: 404 },
      );
    }

    // Check if the candidate already exists in any pipeline stage
    const { data: existing } = await supabase
      .from("pipeline_candidates")
      .select("id")
      .eq("candidate_id", body.candidateId)
      .eq("user_id", user.id)
      .maybeSingle();

    const now = new Date().toISOString();

    if (existing) {
      // Update existing entry — move to the new stage
      const { data: pipelineCandidate, error } = await supabase
        .from("pipeline_candidates")
        .update({
          stage_id: body.stageId,
          notes: body.notes ?? null,
          moved_at: now,
        })
        .eq("id", existing.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Failed to move candidate:", error);
        return NextResponse.json(
          { error: "Failed to move candidate" },
          { status: 500 },
        );
      }

      return NextResponse.json({ pipelineCandidate, action: "moved" });
    } else {
      // Insert new entry
      const { data: pipelineCandidate, error } = await supabase
        .from("pipeline_candidates")
        .insert({
          candidate_id: body.candidateId,
          stage_id: body.stageId,
          user_id: user.id,
          notes: body.notes ?? null,
          moved_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to add candidate to pipeline:", error);
        return NextResponse.json(
          { error: "Failed to add candidate to pipeline" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { pipelineCandidate, action: "added" },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Pipeline move error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
