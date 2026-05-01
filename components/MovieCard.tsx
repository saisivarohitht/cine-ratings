import Link from "next/link";

import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="h-64 w-full object-cover"
      />
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