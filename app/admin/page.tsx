import Link from "next/link";

export const dynamic = 'force-dynamic';

import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { MovieForm } from "@/components/MovieForm";
import { getMovies } from "@/lib/movie-data";

export default async function AdminPage() {
  const movies = await getMovies();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12 text-white lg:px-8">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
        Back to home
      </Link>

      <MovieForm />

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Existing movies
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Manage saved movies</h2>
          <p className="mt-2 text-sm text-slate-400">
            Delete a movie here if you want to remove it and its reviews from MongoDB.
          </p>
        </div>

        {movies.length > 0 ? (
          <div className="grid gap-4">
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
                  <p className="text-sm text-slate-400">
                    {movie.year} • {movie.genre} • {movie.rating.toFixed(1)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                  >
                    View movie
                  </Link>
                  <Link
                    href={`/admin/movies/${movie.id}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:bg-white/10"
                  >
                    Edit movie
                  </Link>
                  <DeleteMovieButton movieId={movie.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-slate-400">
            No movies yet.
          </div>
        )}
      </section>
    </main>
  );
}
