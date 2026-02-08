import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/candidates/[id] ───────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: candidate, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 },
      );
    }

    // Also fetch pipeline info for this candidate
    const { data: pipelineEntry } = await supabase
      .from("pipeline_candidates")
      .select("*, pipeline_stages(*)")
      .eq("candidate_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      candidate,
      pipeline: pipelineEntry ?? null,
    });
  } catch (error) {
    console.error("Candidate GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/candidates/[id] ─────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Only allow updating certain fields
    const allowedFields = [
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
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Set updated_at
    updates.updated_at = new Date().toISOString();

    const { data: candidate, error } = await supabase
      .from("candidates")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !candidate) {
      return NextResponse.json(
        { error: "Candidate not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error("Candidate PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/candidates/[id] ────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete associated pipeline entries first
    await supabase
      .from("pipeline_candidates")
      .delete()
      .eq("candidate_id", id)
      .eq("user_id", user.id);

    // Delete the candidate
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to delete candidate:", error);
      return NextResponse.json(
        { error: "Failed to delete candidate" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Candidate DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
