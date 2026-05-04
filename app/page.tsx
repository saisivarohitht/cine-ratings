import Link from "next/link";

import { MovieList } from "@/components/MovieList";
import { MovieSearchControls } from "@/components/MovieSearchControls";
import { Navbar } from "@/components/Navbar";
import { sampleMovies } from "@/lib/sample-movies";
import { getMovies } from "@/lib/movie-data";

type HomeSearchParams = {
  q?: string;
  sort?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim() || "";
  const sort = params?.sort || "rating-desc";

  const movies = await getMovies();
  const sourceMovies = movies.length > 0 ? movies : sampleMovies;
  const movieSuggestions = sourceMovies.flatMap((movie) => [movie.title, movie.genre]);

  const filteredMovies = query
    ? sourceMovies.filter((movie) => {
        const haystack = `${movie.title} ${movie.genre} ${movie.overview}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : sourceMovies;

  const featuredMovies = [...filteredMovies].sort((a, b) => {
    switch (sort) {
      case "rating-asc":
        return a.rating - b.rating;
      case "year-desc":
        return b.year - a.year;
      case "year-asc":
        return a.year - b.year;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "rating-desc":
      default:
        return b.rating - a.rating;
    }
  });

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">
            Movie reviews and ratings
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover, rate, and review your favorite movies in one place.
          </h1>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Featured movies</h2>
              <p className="mt-1 text-sm text-slate-400">
                {movies.length > 0
                  ? "Live movies from MongoDB"
                  : "Demo movies while the collection is empty"}
              </p>
            </div>
          </div>

          <MovieSearchControls query={query} sort={sort} suggestions={movieSuggestions} />

          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <p>
              Showing {featuredMovies.length} movie{featuredMovies.length === 1 ? "" : "s"}
            </p>
            {(query || sort !== "rating-desc") ? (
              <Link href="/" className="text-amber-300 hover:text-amber-200">
                Reset filters
              </Link>
            ) : null}
          </div>

          <MovieList movies={featuredMovies} />
        </section>
      </main>
    </div>
  );
}
