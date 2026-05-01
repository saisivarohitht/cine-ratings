import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import clientPromise from "../../../../lib/mongodb";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const movie = await db.collection("movies").findOne({ _id: new ObjectId(id) });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const movieResult = await db.collection("movies").deleteOne({ _id: new ObjectId(id) });

    if (movieResult.deletedCount === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await db.collection("reviews").deleteMany({ movieId: id });

    return NextResponse.json({ deletedId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const year = Number(body.year);
    const genre = typeof body.genre === "string" ? body.genre.trim() : "";
    const overview = typeof body.overview === "string" ? body.overview.trim() : "";
    const rating = Number(body.rating);
    const posterUrl = typeof body.posterUrl === "string" ? body.posterUrl.trim() : "";

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

    const result = await db.collection("movies").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          year,
          genre,
          overview,
          rating,
          posterUrl: posterUrl || undefined,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}
