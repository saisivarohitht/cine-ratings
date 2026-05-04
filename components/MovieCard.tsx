"use client";

import Link from "next/link";

import type { Movie } from "@/types/movie";
import { DEFAULT_POSTER_URL } from "@/lib/constants";
import { useState } from "react";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const [posterSrc, setPosterSrc] = useState(movie.posterThumbUrl || movie.posterUrl || DEFAULT_POSTER_URL);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10">
      <div className="w-full aspect-3/2 overflow-hidden">
        <img src={posterSrc} alt={movie.title} className="h-full w-full object-cover" onError={() => { if (posterSrc !== DEFAULT_POSTER_URL) setPosterSrc(DEFAULT_POSTER_URL); }} />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
            <p className="text-sm text-slate-400">
              {movie.year} • {movie.genre}
            </p>
          </div>
          <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
            {movie.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">{movie.overview}</p>
        <Link
          href={`/movie/${movie.id}`}
          className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
        >
          View details
        </Link>
      </div>
    </article>
  );
}