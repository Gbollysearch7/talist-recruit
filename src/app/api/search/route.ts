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

/**
 * Parse a LinkedIn page title into name, title, and company.
 *
 * Common LinkedIn title formats:
 *  - "John Doe - Software Engineer - Google | LinkedIn"
 *  - "John Doe – Senior Developer at Meta | LinkedIn"
 *  - "John Doe | LinkedIn"
 *  - "John Doe - Google | LinkedIn"
 */
function parseLinkedInTitle(pageTitle: string | undefined): {
  name: string;
  jobTitle: string | null;
  company: string | null;
} {
  if (!pageTitle) return { name: "Unknown", jobTitle: null, company: null };

  // Strip trailing "| LinkedIn" or "- LinkedIn"
  let cleaned = pageTitle.replace(/\s*[|–-]\s*LinkedIn\s*$/i, "").trim();

  // Split by common delimiters: " - ", " – ", " | "
  const parts = cleaned.split(/\s*[-–|]\s*/).filter(Boolean);

  if (parts.length === 0) return { name: "Unknown", jobTitle: null, company: null };

  const name = parts[0].trim();

  if (parts.length === 1) {
    return { name, jobTitle: null, company: null };
  }

  if (parts.length === 2) {
    // Could be "Name - Title at Company" or "Name - Company"
    const second = parts[1].trim();
    const atMatch = second.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
    if (atMatch) {
      return { name, jobTitle: atMatch[1].trim(), company: atMatch[2].trim() };
    }
    // If it looks like a role (contains common title words), treat as title
    if (/engineer|developer|manager|director|designer|analyst|lead|head|vp|cto|ceo|founder|consultant/i.test(second)) {
      return { name, jobTitle: second, company: null };
    }
    return { name, jobTitle: null, company: second };
  }

  // 3+ parts: "Name - Title - Company"
  return {
    name,
    jobTitle: parts[1].trim(),
    company: parts[2].trim(),
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

    // ── Fetch already-saved exa_ids to exclude from results ─────────────
    const { data: savedCandidates } = await supabase
      .from("candidates")
      .select("exa_id")
      .eq("user_id", user.id);

    const savedExaIds = new Set(
      (savedCandidates ?? []).map((c) => c.exa_id),
    );

    // ── Exa search ───────────────────────────────────────────────────────
    const desiredResults = filters?.numResults ?? 10;
    const searchResults = await searchCandidates(enrichedQuery, {
      numResults: desiredResults,
      category: filters?.category ?? "linkedin profiles",
      includeDomains: ["linkedin.com/in"],
    });

    // Fetch full contents for the results
    const ids = searchResults.results.map((r) => r.id);
    const contents = ids.length > 0 ? await getContents(ids) : { results: [] };

    // Merge search scores with content and map to Candidate shape
    const allCandidates = searchResults.results.map((sr) => {
      const content = contents.results.find((c) => c.id === sr.id);
      const author = sr.author ?? content?.author ?? null;
      const text = content?.text ?? null;

      // Parse LinkedIn title for structured data
      const parsed = parseLinkedInTitle(sr.title);

      // Prefer author field for name if available
      const name = author || parsed.name;

      return {
        id: sr.id,
        exa_id: sr.id,
        name,
        title: parsed.jobTitle,
        company: parsed.company,
        location: null,
        linkedin_url: sr.url,
        email: null,
        phone: null,
        skills: [] as string[],
        experience_years: null,
        summary: text?.slice(0, 300) ?? null,
        source: "exa",
        score: sr.score,
        user_id: user.id,
        raw_data: { score: sr.score, highlights: content?.highlights ?? [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_saved: savedExaIds.has(sr.id),
      };
    });

    // Filter out already-saved candidates from results
    const candidates = allCandidates.filter((c) => !c.is_saved);
    const excludedCount = allCandidates.length - candidates.length;

    // ── Save search to DB ────────────────────────────────────────────────
    const { error: dbError } = await supabase.from("searches").insert({
      user_id: user.id,
      query,
      filters: (filters ?? null) as Json,
      results_count: candidates.length,
    });

    if (dbError) {
      console.error("Failed to save search:", dbError);
    }

    return NextResponse.json({
      candidates,
      total: candidates.length,
      excludedCount,
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
