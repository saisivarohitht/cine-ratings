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
