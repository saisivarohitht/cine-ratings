import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

type ReviewDocument = {
  _id: ObjectId;
  movieId: string;
  rating: number;
  text: string;
  author?: string;
  createdAt?: Date;
};

type MovieLookup = {
  _id: ObjectId;
  title?: string;
  year?: number;
  posterUrl?: string;
};

export type ReviewWithMovie = {
  id: string;
  movieId: string;
  movieTitle: string;
  movieYear?: number;
  moviePosterUrl?: string;
  rating: number;
  text: string;
  author: string;
  createdAt: string;
};

export async function getReviews(movieId?: string) {
  const client = await clientPromise;
  const db = client.db();

  const filter = movieId ? { movieId } : {};
  const reviews = (await db
    .collection("reviews")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()) as ReviewDocument[];

  const movieIds = [...new Set(reviews.map((review) => review.movieId).filter(Boolean))];

  const movieLookupEntries = movieIds.length
    ? ((await db
        .collection("movies")
        .find({ _id: { $in: movieIds.filter(ObjectId.isValid).map((id) => new ObjectId(id)) } })
        .toArray()) as MovieLookup[])
    : [];

  const movieLookup = new Map(
    movieLookupEntries.map((movie) => [movie._id.toString(), movie])
  );

  return reviews.map<ReviewWithMovie>((review) => {
    const movie = movieLookup.get(review.movieId);

    return {
      id: review._id.toString(),
      movieId: review.movieId,
      movieTitle: movie?.title ?? "Unknown movie",
      movieYear: movie?.year,
      moviePosterUrl: movie?.posterUrl,
      rating: review.rating,
      text: review.text,
      author: review.author || "Anonymous",
      createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
    };
  });
}
