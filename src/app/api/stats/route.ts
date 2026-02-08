import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── GET /api/stats ─────────────────────────────────────────────────────────
// Returns dashboard statistics:
//   - totalCandidates
//   - totalSearches
//   - pipelineCounts (candidates per stage)
//   - recentActivity (last 10 actions)

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run all queries in parallel for performance
    const [
      candidatesResult,
      searchesResult,
      stagesResult,
      pipelineCandidatesResult,
      recentCandidatesResult,
      recentSearchesResult,
    ] = await Promise.all([
      // Total candidates
      supabase
        .from("candidates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

      // Total searches
      supabase
        .from("searches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

      // All pipeline stages
      supabase
        .from("pipeline_stages")
        .select("id, name, color, position")
        .eq("user_id", user.id)
        .order("position", { ascending: true }),

      // Pipeline candidates (for counting per stage)
      supabase
        .from("pipeline_candidates")
        .select("stage_id")
        .eq("user_id", user.id),

      // Recent candidates (last 10)
      supabase
        .from("candidates")
        .select("id, name, title, company, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),

      // Recent searches (last 10)
      supabase
        .from("searches")
        .select("id, query, results_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Compute per-stage counts
    const stages = stagesResult.data ?? [];
    const pipelineCandidates = pipelineCandidatesResult.data ?? [];

    const pipelineCounts = stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      color: stage.color,
      position: stage.position,
      count: pipelineCandidates.filter((pc) => pc.stage_id === stage.id)
        .length,
    }));

    // Merge recent candidates and searches into a single activity feed
    const recentCandidates = (recentCandidatesResult.data ?? []).map((c) => ({
      type: "candidate_added" as const,
      id: c.id,
      description: `Saved candidate: ${c.name}${c.title ? ` — ${c.title}` : ""}${c.company ? ` at ${c.company}` : ""}`,
      timestamp: c.created_at,
    }));

    const recentSearches = (recentSearchesResult.data ?? []).map((s) => ({
      type: "search" as const,
      id: s.id,
      description: `Searched: "${s.query}" (${s.results_count ?? 0} results)`,
      timestamp: s.created_at,
    }));

    const recentActivity = [...recentCandidates, ...recentSearches]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);

    return NextResponse.json({
      totalCandidates: candidatesResult.count ?? 0,
      totalSearches: searchesResult.count ?? 0,
      pipelineCounts,
      recentActivity,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
