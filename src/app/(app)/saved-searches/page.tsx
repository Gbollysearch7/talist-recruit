"use client";

import * as React from "react";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Calendar,
  Filter,
  Loader2,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────────────────────────────

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  query: string;
  filters: Record<string, unknown> | null;
  created_at: string;
}

// ─── Filter Summary ─────────────────────────────────────────────────────────

function FilterSummary({ filters }: { filters: Record<string, unknown> | null }) {
  if (!filters || Object.keys(filters).length === 0) {
    return null;
  }

  const entries = Object.entries(filters).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {entries.map(([key, value]) => (
        <Badge key={key} variant="outline" className="text-[10px]">
          <Filter className="h-2.5 w-2.5 mr-1" />
          {key}: {String(value)}
        </Badge>
      ))}
    </div>
  );
}

// ─── Search Card ────────────────────────────────────────────────────────────

function SavedSearchCard({
  search,
  onRunAgain,
  onDelete,
  isDeleting,
}: {
  search: SavedSearch;
  onRunAgain: (search: SavedSearch) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="border border-[#333] bg-[#121212] p-5 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 shrink-0 text-[rgba(255,255,255,0.6)]" />
            <h3 className="text-base font-medium text-white truncate">
              {search.name}
            </h3>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-[rgba(255,255,255,0.4)]" />
            <p className="text-sm text-[rgba(255,255,255,0.6)] truncate">
              {search.query}
            </p>
          </div>

          <FilterSummary filters={search.filters} />

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.4)]">
            <Calendar className="h-3 w-3" />
            <span>
              Saved {format(new Date(search.created_at), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRunAgain(search)}
          >
            <Play className="h-4 w-4" />
            Run Again
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Delete "${search.name}"?`)) {
                onDelete(search.id);
              }
            }}
            disabled={isDeleting}
            className="text-[rgba(255,255,255,0.6)] hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SavedSearchesPage() {
  const { savedSearches, isLoading, deleteSearch, isDeleting } =
    useSavedSearches();
  const router = useRouter();

  function handleRunAgain(search: SavedSearch) {
    // Navigate to search page with query params
    const params = new URLSearchParams();
    params.set("q", search.query);
    if (search.filters) {
      params.set("filters", JSON.stringify(search.filters));
    }
    router.push(`/search?${params.toString()}`);
  }

  function handleDelete(id: string) {
    deleteSearch(id);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-[rgba(255,255,255,0.6)]" />
        <h1 className="text-2xl font-bold text-white">Saved Searches</h1>
        <Badge variant="outline" className="tabular-nums">
          {savedSearches.length}
        </Badge>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[rgba(255,255,255,0.6)]" />
        </div>
      ) : savedSearches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center border border-dashed border-[#333] py-20">
          <Search className="h-12 w-12 text-[rgba(255,255,255,0.2)] mb-4" />
          <p className="text-[rgba(255,255,255,0.6)] mb-1">
            No saved searches yet
          </p>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4 max-w-md text-center">
            When you perform a search and save it, it will appear here so you
            can quickly run it again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/search")}
          >
            <Search className="h-4 w-4" />
            Go to Search
          </Button>
        </div>
      ) : (
        /* Search Cards */
        <div className="flex flex-col gap-3">
          {savedSearches.map((search: SavedSearch) => (
            <SavedSearchCard
              key={search.id}
              search={search}
              onRunAgain={handleRunAgain}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
