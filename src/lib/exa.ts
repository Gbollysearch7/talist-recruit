// ─── Exa API Client ─────────────────────────────────────────────────────────
// Thin wrapper around the Exa search & contents REST APIs using fetch().
// Docs: https://docs.exa.ai

const EXA_BASE_URL = "https://api.exa.ai";

function getApiKey(): string {
  const key = process.env.EXA_API_KEY;
  if (!key) {
    throw new Error("EXA_API_KEY environment variable is not set");
  }
  return key;
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getApiKey()}`,
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ExaSearchResult {
  id: string;
  url: string;
  title: string;
  score: number;
  publishedDate?: string;
  author?: string;
  text?: string;
  highlights?: string[];
  highlightScores?: number[];
}

export interface ExaSearchResponse {
  requestId: string;
  autopromptString?: string;
  results: ExaSearchResult[];
}

export interface ExaContentResult {
  id: string;
  url: string;
  title: string;
  text?: string;
  highlights?: string[];
  highlightScores?: number[];
  author?: string;
  publishedDate?: string;
}

export interface ExaContentsResponse {
  requestId: string;
  results: ExaContentResult[];
}

export interface SearchCandidatesOptions {
  numResults?: number;
  category?: "linkedin profiles" | "company" | "people" | "tweet" | "research paper" | "news" | "pdf";
  includeDomains?: string[];
}

// ─── Search ─────────────────────────────────────────────────────────────────

/**
 * Perform a neural search via the Exa /search endpoint.
 *
 * Defaults to category "linkedin profiles" and 10 results.
 */
export async function searchCandidates(
  query: string,
  options?: SearchCandidatesOptions,
): Promise<ExaSearchResponse> {
  const {
    numResults = 10,
    category = "linkedin profiles",
    includeDomains = ["linkedin.com"],
  } = options ?? {};

  const response = await fetch(`${EXA_BASE_URL}/search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      query,
      type: "neural",
      numResults,
      category,
      useAutoprompt: true,
      includeDomains,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Exa search failed (${response.status}): ${errorBody}`,
    );
  }

  const data: ExaSearchResponse = await response.json();
  return data;
}

// ─── Contents ───────────────────────────────────────────────────────────────

/**
 * Retrieve full page contents for a list of Exa result IDs via /contents.
 */
export async function getContents(
  ids: string[],
): Promise<ExaContentsResponse> {
  if (ids.length === 0) {
    return { requestId: "", results: [] };
  }

  const response = await fetch(`${EXA_BASE_URL}/contents`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      ids,
      text: true,
      highlights: {
        numSentences: 3,
        highlightsPerUrl: 3,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Exa contents failed (${response.status}): ${errorBody}`,
    );
  }

  const data: ExaContentsResponse = await response.json();
  return data;
}
