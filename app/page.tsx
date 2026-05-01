import { MovieList } from "@/components/MovieList";
import { Navbar } from "@/components/Navbar";
import { sampleMovies } from "@/lib/sample-movies";
import { getMovies } from "@/lib/movie-data";

export default async function Home() {
  const movies = await getMovies();
  const featuredMovies = movies.length > 0 ? movies : sampleMovies;

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
          <MovieList movies={featuredMovies} />
        </section>
      </main>
    </div>
  );
}
