import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import clientPromise from "../../../../lib/mongodb";
import { recalculateMovieRating } from "@/lib/rating";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await recalculateMovieRating(review.movieId);

    return NextResponse.json({ deletedId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

    const body = await request.json();
    const rating = Number(body.rating);
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const author = typeof body.author === "string" ? body.author.trim() : "Anonymous";

    if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 10" }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ error: "Review text is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const reviewsCollection = db.collection("reviews");
    const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          rating,
          text,
          author,
        },
      }
    );

    await recalculateMovieRating(review.movieId);

    return NextResponse.json({ updatedId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
