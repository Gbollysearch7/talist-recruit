import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── GET /api/pipeline ──────────────────────────────────────────────────────
// Returns all pipeline stages (ordered by position) with their candidates.

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch stages ordered by position
    const { data: stages, error: stagesError } = await supabase
      .from("pipeline_stages")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (stagesError) {
      console.error("Failed to fetch pipeline stages:", stagesError);
      return NextResponse.json(
        { error: "Failed to fetch pipeline stages" },
        { status: 500 },
      );
    }

    // Fetch all pipeline candidates for this user, joined with candidate details
    const { data: pipelineCandidates, error: pcError } = await supabase
      .from("pipeline_candidates")
      .select("*, candidates(*)")
      .eq("user_id", user.id)
      .order("moved_at", { ascending: false });

    if (pcError) {
      console.error("Failed to fetch pipeline candidates:", pcError);
      return NextResponse.json(
        { error: "Failed to fetch pipeline candidates" },
        { status: 500 },
      );
    }

    // Group candidates by stage
    const stagesWithCandidates = (stages ?? []).map((stage) => ({
      ...stage,
      candidates: (pipelineCandidates ?? [])
        .filter((pc) => pc.stage_id === stage.id)
        .map((pc) => ({
          pipeline_candidate_id: pc.id,
          candidate: pc.candidates,
          notes: pc.notes,
          moved_at: pc.moved_at,
          created_at: pc.created_at,
        })),
    }));

    return NextResponse.json({ stages: stagesWithCandidates });
  } catch (error) {
    console.error("Pipeline GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── POST /api/pipeline ─────────────────────────────────────────────────────
// Create a new pipeline stage.

interface CreateStageBody {
  name: string;
  color?: string | null;
  position?: number;
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

    const body: CreateStageBody = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Stage name is required" },
        { status: 400 },
      );
    }

    // If no position is given, place at the end
    let position = body.position;
    if (position === undefined) {
      const { data: lastStage } = await supabase
        .from("pipeline_stages")
        .select("position")
        .eq("user_id", user.id)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      position = (lastStage?.position ?? 0) + 1;
    }

    const { data: stage, error } = await supabase
      .from("pipeline_stages")
      .insert({
        user_id: user.id,
        name: body.name,
        position,
        color: body.color ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create stage:", error);
      return NextResponse.json(
        { error: "Failed to create stage" },
        { status: 500 },
      );
    }

    return NextResponse.json({ stage }, { status: 201 });
  } catch (error) {
    console.error("Pipeline POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
