import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── GET /api/search-history ────────────────────────────────────────────────
// List recent searches for the current user, most recent first.

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: searches, error } = await supabase
      .from("searches")
      .select("id, query, filters, results_count, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to fetch search history:", error);
      return NextResponse.json(
        { error: "Failed to fetch search history" },
        { status: 500 },
      );
    }

    return NextResponse.json(searches ?? []);
  } catch (error) {
    console.error("Search history GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
