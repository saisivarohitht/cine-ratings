import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import type { Movie } from "@/types/movie";

export type MovieDocument = {
  _id: ObjectId;
  title?: string;
  year?: number;
  genre?: string;
  rating?: number;
  overview?: string;
  description?: string;
  posterUrl?: string;
};

const DEFAULT_POSTER_URL =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80";

export function mapMovieDocument(document: MovieDocument): Movie {
  return {
    id: document._id.toString(),
    title: String(document.title ?? "Untitled movie"),
    year: typeof document.year === "number" ? document.year : new Date().getFullYear(),
    genre: typeof document.genre === "string" ? document.genre : "Unknown",
    rating: typeof document.rating === "number" ? document.rating : 0,
    overview: String(document.overview ?? document.description ?? "No description available yet."),
    posterUrl: typeof document.posterUrl === "string" ? document.posterUrl : DEFAULT_POSTER_URL,
  };
}

export async function getMovies() {
  const client = await clientPromise;
  const db = client.db();
  const movies = (await db.collection("movies").find({}).limit(100).toArray()) as MovieDocument[];

  return movies.map(mapMovieDocument);
}

export async function getMovieById(movieId: string) {
  if (!ObjectId.isValid(movieId)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db();
  const movie = (await db.collection("movies").findOne({ _id: new ObjectId(movieId) })) as MovieDocument | null;

  return movie ? mapMovieDocument(movie) : null;
}
