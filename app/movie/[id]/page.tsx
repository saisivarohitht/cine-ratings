import { ObjectId } from "mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewForm } from "@/components/ReviewForm";
import { sampleMovies } from "@/lib/sample-movies";
import clientPromise from "@/lib/mongodb";

type ReviewDocument = {
  _id: ObjectId;
  movieId: string;
  rating: number;
  text: string;
  author?: string;
  createdAt?: Date;
};

type PageMovie = {
  title: string;
  year?: number;
  genre?: string;
  rating?: number;
  overview: string;
  posterUrl?: string;
};

function getFallbackMovie(id: string): PageMovie | null {
  const movie = sampleMovies.find((entry) => entry.id === id);

  if (!movie) {
    return null;
  }

  return {
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    rating: movie.rating,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
  };
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fallbackMovie = getFallbackMovie(id);
  let movie: PageMovie | null = fallbackMovie;
  let reviews: ReviewDocument[] = [];
  let databaseMovieId: string | null = null;

  if (ObjectId.isValid(id)) {
    const client = await clientPromise;
    const db = client.db();
    const movieDocument = await db.collection("movies").findOne({ _id: new ObjectId(id) });

    if (movieDocument) {
      movie = {
        title: String(movieDocument.title ?? "Untitled movie"),
        year: typeof movieDocument.year === "number" ? movieDocument.year : undefined,
        genre: typeof movieDocument.genre === "string" ? movieDocument.genre : undefined,
        rating: typeof movieDocument.rating === "number" ? movieDocument.rating : undefined,
        overview: String(movieDocument.overview ?? movieDocument.description ?? "No description available yet."),
        posterUrl: typeof movieDocument.posterUrl === "string" ? movieDocument.posterUrl : undefined,
      };
      databaseMovieId = id;
      reviews = (await db
        .collection("reviews")
        .find({ movieId: id })
        .sort({ createdAt: -1 })
        .toArray()) as ReviewDocument[];
    }
  }

  if (!movie) {
    notFound();
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
      : movie.rating?.toFixed(1) ?? "N/A";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 text-white lg:px-8">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
        Back to home
      </Link>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 lg:grid-cols-[320px_1fr] lg:p-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-105 items-center justify-center bg-linear-to-br from-amber-300/30 via-slate-950 to-slate-900 px-6 text-center text-3xl font-semibold text-white">
              {movie.title}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">
            Movie details
          </p>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{movie.title}</h1>
            <p className="mt-3 text-slate-300">
              {[movie.year, movie.genre].filter(Boolean).join(" • ") || "Movie details from MongoDB or demo data"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
              Average rating: {averageRating}
            </div>
            {databaseMovieId ? (
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                MongoDB-backed movie
              </div>
            ) : (
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Demo movie
              </div>
            )}
          </div>

          <p className="max-w-3xl text-lg leading-8 text-slate-300">{movie.overview}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Reviews</h2>
              <p className="mt-1 text-sm text-slate-400">
                {databaseMovieId
                  ? `${reviews.length} review${reviews.length === 1 ? "" : "s"} for this movie`
                  : "Reviews are available for MongoDB movies only."}
              </p>
            </div>
          </div>

          {databaseMovieId ? (
            reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <article key={review._id.toString()} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{review.author || "Anonymous"}</h3>
                        <p className="text-sm text-slate-400">
                          {review.createdAt ? new Date(review.createdAt).toLocaleString() : "Recently"}
                        </p>
                      </div>
                      <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
                        {review.rating}/10
                      </div>
                    </div>
                    <p className="mt-4 leading-7 text-slate-300">{review.text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-slate-400">
                No reviews yet. Be the first to write one.
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-slate-400">
              This page is using demo movie data. Add a MongoDB movie to see live reviews here.
            </div>
          )}
        </div>

        <div>{databaseMovieId ? <ReviewForm movieId={databaseMovieId} /> : null}</div>
      </section>
    </main>
  );
}
