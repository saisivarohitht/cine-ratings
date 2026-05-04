import Link from "next/link";

import { DeleteReviewButton } from "@/components/DeleteReviewButton";
import { ReviewSearchControls } from "@/components/ReviewSearchControls";
import { getMovies } from "@/lib/movie-data";
import { getReviews } from "@/lib/review-data";

type ReviewsSearchParams = {
  movieId?: string;
  q?: string;
  sort?: string;
};

function buildReviewsHref(movieId: string | undefined, query: string, sort: string) {
  const search = new URLSearchParams();

  if (movieId) {
    search.set("movieId", movieId);
  }

  if (query) {
    search.set("q", query);
  }

  if (sort !== "newest") {
    search.set("sort", sort);
  }

  const queryString = search.toString();
  return queryString ? `/reviews?${queryString}` : "/reviews";
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<ReviewsSearchParams>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const movieId = params?.movieId || "";
  const query = params?.q?.trim() || "";
  const sort = params?.sort || "newest";

  const [movies, allReviews] = await Promise.all([getMovies(), getReviews(movieId)]);
  const selectedMovie = movieId ? movies.find((movie) => movie.id === movieId) : undefined;
  const reviewSuggestions = allReviews.flatMap((review) => [
    review.movieTitle,
    review.author,
    review.text,
  ]);

  const filteredReviews = query
    ? allReviews.filter((review) => {
        const haystack = `${review.movieTitle} ${review.author} ${review.text}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : allReviews;

  const reviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "rating-desc":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12 text-white lg:px-8">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
        Back to home
      </Link>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Reviews
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">
              {selectedMovie ? `${selectedMovie.title} reviews` : "All reviews"}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {selectedMovie
                ? `Showing reviews for ${selectedMovie.title}.`
                : "Browse the latest reviews stored in MongoDB."}
            </p>
          </div>
          {movieId ? (
            <Link
              href={buildReviewsHref(undefined, query, sort)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-300/40 hover:bg-white/10"
            >
              Show all reviews
            </Link>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <ReviewSearchControls
          movieId={movieId}
          query={query}
          sort={sort}
          movieOptions={movies.map((movie) => ({ id: movie.id, title: movie.title }))}
          suggestions={reviewSuggestions}
        />

        <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
          <p>
            Showing {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>
          {(query || sort !== "newest") ? (
            <Link
              href={buildReviewsHref(movieId, "", "newest")}
              className="text-amber-300 hover:text-amber-200"
            >
              Reset search and sort
            </Link>
          ) : null}
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 sm:grid-cols-[120px_1fr]"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                  {review.moviePosterUrl ? (
                    <img
                      src={review.moviePosterUrl}
                      alt={review.movieTitle}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center px-4 text-center text-sm text-slate-400">
                      No poster
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                        {review.movieTitle}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">
                        {review.author}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                      {review.rating}/10
                    </div>
                  </div>

                  <p className="leading-7 text-slate-300">{review.text}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/movie/${review.movieId}`}
                      className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                    >
                      View movie
                    </Link>
                    {review.movieYear ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        {review.movieYear}
                      </span>
                    ) : null}
                    <Link
                      href={`/reviews/${review.id}/edit`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:bg-white/10"
                    >
                      Edit review
                    </Link>
                    <DeleteReviewButton reviewId={review.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-slate-400">
            No reviews found yet. Add one from a movie page to populate this view.
          </div>
        )}
      </section>
    </main>
  );
}