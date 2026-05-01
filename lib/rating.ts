import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function recalculateMovieRating(movieId: string) {
  if (!ObjectId.isValid(movieId)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db();

  const reviews = await db.collection("reviews").find({ movieId }).toArray();
  const rating =
    reviews.length > 0
      ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1))
      : 0;

  await db.collection("movies").updateOne(
    { _id: new ObjectId(movieId) },
    { $set: { rating } }
  );

  return rating;
}
