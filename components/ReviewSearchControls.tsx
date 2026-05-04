"use client";

import { useEffect, useMemo, useState } from "react";
import Autocomplete from "./Autocomplete";
import { usePathname, useRouter } from "next/navigation";

type ReviewSearchControlsProps = {
  movieId: string;
  query: string;
  sort: string;
  movieOptions: Array<{ id: string; title: string }>;
  suggestions: string[];
};

export function ReviewSearchControls({
  movieId,
  query,
  sort,
  movieOptions,
  suggestions,
}: ReviewSearchControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localQuery, setLocalQuery] = useState(query);
  const [localMovieId, setLocalMovieId] = useState(movieId);
  const [localSort, setLocalSort] = useState(sort);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    setLocalMovieId(movieId);
  }, [movieId]);

  useEffect(() => {
    setLocalSort(sort);
  }, [sort]);

  const uniqueSuggestions = useMemo(
    () => [...new Set(suggestions.map((entry) => entry.trim()).filter(Boolean))].slice(0, 25),
    [suggestions]
  );

  function navigate(nextMovieId: string, nextQuery: string, nextSort: string) {
    const params = new URLSearchParams();

    if (nextMovieId) {
      params.set("movieId", nextMovieId);
    }

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextSort !== "newest") {
      params.set("sort", nextSort);
    }

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate(localMovieId, localQuery, localSort);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [localMovieId, localQuery, localSort]);

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_auto_auto]">
      <div>
        <Autocomplete
          id="review-search"
          value={localQuery}
          onChange={(v) => setLocalQuery(v)}
          onSelect={(v) => setLocalQuery(v)}
          suggestions={uniqueSuggestions}
          placeholder="Search by movie, author, or review text"
        />
      </div>

      <select
        value={localMovieId}
        onChange={(event) => setLocalMovieId(event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
      >
        <option value="">All movies</option>
        {movieOptions.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>

      <select
        value={localSort}
        onChange={(event) => setLocalSort(event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="rating-desc">Rating: High to low</option>
        <option value="rating-asc">Rating: Low to high</option>
      </select>
    </div>
  );
}
