"use client";

import { useEffect, useMemo, useState } from "react";
import Autocomplete from "./Autocomplete";
import { usePathname, useRouter } from "next/navigation";

type MovieSearchControlsProps = {
  query: string;
  sort: string;
  suggestions: string[];
};

export function MovieSearchControls({ query, sort, suggestions }: MovieSearchControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const uniqueSuggestions = useMemo(
    () => [...new Set(suggestions.map((entry) => entry.trim()).filter(Boolean))].slice(0, 20),
    [suggestions]
  );

  function navigate(nextQuery: string, nextSort: string) {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextSort !== "rating-desc") {
      params.set("sort", nextSort);
    }

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate(localQuery, sort);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [localQuery, sort]);

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_auto]">
      <div className="relative">
        <Autocomplete
          id="movie-search"
          value={localQuery}
          onChange={(v) => setLocalQuery(v)}
          onSelect={(v) => setLocalQuery(v)}
          suggestions={uniqueSuggestions}
          placeholder="Search by title, genre, or overview"
        />
        {localQuery && (
          <button
            type="button"
            onClick={() => setLocalQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <select
        name="sort"
        value={sort}
        onChange={(event) => navigate(localQuery, event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
      >
        <option value="rating-desc">Rating: High to low</option>
        <option value="rating-asc">Rating: Low to high</option>
        <option value="year-desc">Year: New to old</option>
        <option value="year-asc">Year: Old to new</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
      </select>
    </div>
  );
}
