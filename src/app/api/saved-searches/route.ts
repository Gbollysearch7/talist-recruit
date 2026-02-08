import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

// ─── GET /api/saved-searches ────────────────────────────────────────────────
// List all saved searches for the current user, most recent first.

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: savedSearches, error } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch saved searches:", error);
      return NextResponse.json(
        { error: "Failed to fetch saved searches" },
        { status: 500 },
      );
    }

    return NextResponse.json({ savedSearches: savedSearches ?? [] });
  } catch (error) {
    console.error("Saved searches GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── POST /api/saved-searches ───────────────────────────────────────────────
// Save a search for later re-use.
//
// Body: { name: string, query: string, filters?: object }

interface SaveSearchBody {
  name: string;
  query: string;
  filters?: Record<string, unknown>;
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

    const body: SaveSearchBody = await request.json();

    if (!body.name || !body.query) {
      return NextResponse.json(
        { error: "name and query are required" },
        { status: 400 },
      );
    }

    const { data: savedSearch, error } = await supabase
      .from("saved_searches")
      .insert({
        user_id: user.id,
        name: body.name,
        query: body.query,
        filters: (body.filters ?? null) as Json,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save search:", error);
      return NextResponse.json(
        { error: "Failed to save search" },
        { status: 500 },
      );
    }

    return NextResponse.json({ savedSearch }, { status: 201 });
  } catch (error) {
    console.error("Saved searches POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
