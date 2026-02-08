import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchCandidates, getContents } from "@/lib/exa";
import type { SearchCandidatesOptions } from "@/lib/exa";
import type { Json } from "@/types/database";

interface SearchRequestBody {
  query: string;
  filters?: {
    numResults?: number;
    category?: SearchCandidatesOptions["category"];
    location?: string;
    title?: string;
    company?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse body ───────────────────────────────────────────────────────
    const body: SearchRequestBody = await request.json();

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json(
        { error: "A search query is required" },
        { status: 400 },
      );
    }

    const { query, filters } = body;

    // Build the enriched query — append optional location/title/company hints
    let enrichedQuery = query;
    if (filters?.location) enrichedQuery += ` ${filters.location}`;
    if (filters?.title) enrichedQuery += ` ${filters.title}`;
    if (filters?.company) enrichedQuery += ` ${filters.company}`;

    // ── Exa search ───────────────────────────────────────────────────────
    const searchResults = await searchCandidates(enrichedQuery, {
      numResults: filters?.numResults ?? 10,
      category: filters?.category ?? "linkedin profiles",
    });

    // Fetch full contents for the results
    const ids = searchResults.results.map((r) => r.id);
    const contents = ids.length > 0 ? await getContents(ids) : { results: [] };

    // Merge search scores with content
    const candidates = searchResults.results.map((sr) => {
      const content = contents.results.find((c) => c.id === sr.id);
      return {
        exa_id: sr.id,
        url: sr.url,
        title: sr.title,
        score: sr.score,
        author: sr.author ?? content?.author ?? null,
        publishedDate: sr.publishedDate ?? content?.publishedDate ?? null,
        text: content?.text ?? null,
        highlights: content?.highlights ?? [],
      };
    });

    // ── Save search to DB ────────────────────────────────────────────────
    const { error: dbError } = await supabase.from("searches").insert({
      user_id: user.id,
      query,
      filters: (filters ?? null) as Json,
      results_count: candidates.length,
    });

    if (dbError) {
      console.error("Failed to save search:", dbError);
      // Non-fatal — we still return results even if the DB write fails
    }

    return NextResponse.json({
      candidates,
      total: candidates.length,
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
