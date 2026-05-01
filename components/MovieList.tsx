import type { Movie } from "@/types/movie";

import { MovieCard } from "@/components/MovieCard";

type MovieListProps = {
  movies: Movie[];
};

export function MovieList({ movies }: MovieListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}