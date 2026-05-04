import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import clientPromise from "../../../lib/mongodb";
import { recalculateMovieRating } from "@/lib/rating";
import { CreateReviewSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    const client = await clientPromise;
    const db = client.db();

    const filter = movieId ? { movieId } : {};
    const reviews = await db
      .collection("reviews")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const validation = CreateReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { movieId, rating, text, author } = validation.data;

    if (!ObjectId.isValid(movieId)) {
      return NextResponse.json({ error: "A valid movieId is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const moviesCollection = db.collection("movies");
    const reviewsCollection = db.collection("reviews");

    const movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const review = {
      movieId,
      rating,
      text,
      author: author || "Anonymous",
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(review);
    await recalculateMovieRating(movieId);

    return NextResponse.json(
      {
        insertedId: result.insertedId,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
