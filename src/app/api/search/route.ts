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
    excludeSearchIds?: string[];
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
  const cleaned = pageTitle.replace(/\s*[|–-]\s*LinkedIn\s*$/i, "").trim();

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
    if (/engineer|developer|manager|director|designer|analyst|lead|head|vp|cto|ceo|founder|consultant|product|marketing|senior|junior|principal|staff/i.test(second)) {
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

/**
 * Parse the LinkedIn profile text to extract structured data.
 * LinkedIn profile text typically starts with headline info followed by experience.
 */
function parseLinkedInText(text: string | undefined | null): {
  jobTitle: string | null;
  company: string | null;
  location: string | null;
} {
  if (!text) return { jobTitle: null, company: null, location: null };

  // LinkedIn text usually has the headline near the top.
  // Common patterns in the first few lines:
  // "Senior Product Manager at Google"
  // "Software Engineer · Amazon"
  // "Product Designer | Figma | Previously at Uber"
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let jobTitle: string | null = null;
  let company: string | null = null;
  let location: string | null = null;

  // Look at first ~10 lines for headline/role info
  const headSection = lines.slice(0, 15);

  for (const line of headSection) {
    // Skip very short or very long lines
    if (line.length < 3 || line.length > 200) continue;

    // "Title at Company" or "Title @ Company"
    const atMatch = line.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
    if (atMatch && !jobTitle) {
      const possibleTitle = atMatch[1].trim();
      const possibleCompany = atMatch[2].trim();
      // Validate it looks like a job title (not too long, not a URL)
      if (possibleTitle.length < 80 && !possibleTitle.includes("http")) {
        jobTitle = possibleTitle;
        company = possibleCompany.split(/[|·]/).at(0)?.trim() ?? possibleCompany;
        continue;
      }
    }

    // "Title · Company" or "Title | Company"
    const dotMatch = line.match(/^(.+?)\s*[·|]\s*(.+)$/);
    if (dotMatch && !jobTitle) {
      const possibleTitle = dotMatch[1].trim();
      const possibleCompany = dotMatch[2].trim();
      if (
        possibleTitle.length < 80 &&
        possibleCompany.length < 80 &&
        !possibleTitle.includes("http") &&
        /engineer|developer|manager|director|designer|analyst|lead|head|vp|cto|ceo|coo|founder|consultant|product|marketing|senior|junior|principal|staff|intern|associate|officer|specialist|coordinator|recruiter|partner|advisor|architect|scientist|researcher|writer|editor|strategist/i.test(possibleTitle)
      ) {
        jobTitle = possibleTitle;
        company = possibleCompany.split(/[|·]/).at(0)?.trim() ?? possibleCompany;
        continue;
      }
    }

    // Look for location patterns (e.g., "London, England, United Kingdom" or "San Francisco Bay Area")
    if (!location && /,\s*(United Kingdom|United States|Canada|Australia|Germany|France|India|Nigeria|Brazil|Area|Region)/i.test(line)) {
      if (line.length < 80) {
        location = line;
        continue;
      }
    }

    // Standalone role-like line near the top
    if (!jobTitle && line.length < 80 && !line.includes("http") &&
        /^(senior|junior|principal|staff|lead|chief|head|vp|director|manager|associate|intern)?\s*(software|product|data|marketing|sales|frontend|backend|fullstack|full.stack|devops|cloud|mobile|web|ux|ui|design|research|business|growth|people|hr|finance|operations|content|community|solutions|technical|engineering|program)/i.test(line)) {
      jobTitle = line;
    }
  }

  // Try to extract company from "Experience" section if not found yet
  if (!company) {
    const expIdx = lines.findIndex((l) => /^experience$/i.test(l));
    if (expIdx !== -1 && expIdx + 1 < lines.length) {
      // The line right after "Experience" is often the company name
      const nextLines = lines.slice(expIdx + 1, expIdx + 5);
      for (const l of nextLines) {
        if (l.length > 2 && l.length < 80 && !l.includes("http") && !/^\d/.test(l)) {
          company = l;
          break;
        }
      }
    }
  }

  return { jobTitle, company, location };
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

    // ── Fetch exa_ids from excluded searches ─────────────────────────
    const excludeSearchIds = filters?.excludeSearchIds ?? [];
    if (excludeSearchIds.length > 0) {
      // Get the search results (stored as raw_data) from previous searches
      // We look up candidates that were found in those searches
      const { data: excludedSearches } = await supabase
        .from("searches")
        .select("id, query")
        .in("id", excludeSearchIds)
        .eq("user_id", user.id);

      if (excludedSearches && excludedSearches.length > 0) {
        // Also check candidates table for candidates sourced from those searches
        const { data: excludedCandidates } = await supabase
          .from("candidates")
          .select("exa_id")
          .eq("user_id", user.id);

        if (excludedCandidates) {
          for (const c of excludedCandidates) {
            if (c.exa_id) savedExaIds.add(c.exa_id);
          }
        }
      }
    }

    // ── Exa search (with inline contents) ──────────────────────────────
    const desiredResults = filters?.numResults ?? 10;
    const searchResults = await searchCandidates(enrichedQuery, {
      numResults: desiredResults,
      category: filters?.category ?? "linkedin profiles",
      includeDomains: ["linkedin.com/in"],
    });

    // Fetch full contents for the results
    const ids = searchResults.results.map((r) => r.id);
    const contents = ids.length > 0 ? await getContents(ids) : { results: [] };


    // Map results to Candidate shape, using both title parsing and text parsing
    const allCandidates = searchResults.results.map((sr) => {
      const content = contents.results.find((c) => c.id === sr.id);
      const author = sr.author ?? content?.author ?? null;
      const text = content?.text ?? null;

      // Parse LinkedIn page title for structured data
      const fromTitle = parseLinkedInTitle(sr.title);

      // Parse text content for richer company/title data
      const fromText = parseLinkedInText(text);

      // Prefer author field for name, then title parse
      const name = author || fromTitle.name;

      // Merge: prefer text-parsed data (richer), fallback to title-parsed
      const jobTitle = fromText.jobTitle || fromTitle.jobTitle;
      const company = fromText.company || fromTitle.company;
      const location = fromText.location;

      return {
        id: sr.id,
        exa_id: sr.id,
        name,
        title: jobTitle,
        company,
        location,
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
