import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// ─── PATCH /api/pipeline/[id] ───────────────────────────────────────────────
// Update a pipeline stage (name, color, position).

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

    const allowedFields = ["name", "color", "position"] as const;
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

    const { data: stage, error } = await supabase
      .from("pipeline_stages")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !stage) {
      return NextResponse.json(
        { error: "Stage not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ stage });
  } catch (error) {
    console.error("Pipeline PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/pipeline/[id] ──────────────────────────────────────────────
// Delete a pipeline stage and all associated pipeline_candidates entries.

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

    // Remove all candidates from this stage first
    await supabase
      .from("pipeline_candidates")
      .delete()
      .eq("stage_id", id)
      .eq("user_id", user.id);

    // Delete the stage
    const { error } = await supabase
      .from("pipeline_stages")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to delete stage:", error);
      return NextResponse.json(
        { error: "Failed to delete stage" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pipeline DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
