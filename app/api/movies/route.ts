import { getMovies } from "@/lib/movie-data";
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json(movies);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const year = Number(data.year);
    const genre = typeof data.genre === "string" ? data.genre.trim() : "";
    const overview = typeof data.overview === "string" ? data.overview.trim() : "";
    const rating = Number(data.rating);
    const posterUrl = typeof data.posterUrl === "string" ? data.posterUrl.trim() : "";

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!Number.isFinite(year) || year < 1800 || year > 2100) {
      return NextResponse.json({ error: "Year must be a valid number" }, { status: 400 });
    }

    if (!genre) {
      return NextResponse.json({ error: "Genre is required" }, { status: 400 });
    }

    if (!overview) {
      return NextResponse.json({ error: "Overview is required" }, { status: 400 });
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      return NextResponse.json({ error: "Rating must be between 0 and 10" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const movie = {
      title,
      year,
      genre,
      overview,
      rating,
      posterUrl: posterUrl || undefined,
    };

    const result = await db.collection("movies").insertOne(movie);
    return NextResponse.json({ insertedId: result.insertedId, movie }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
