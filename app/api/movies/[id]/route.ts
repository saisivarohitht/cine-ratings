import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

import clientPromise from "../../../../lib/mongodb";
import { UpdateMovieSchema } from "../../../../lib/schemas";

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

    // Validate input using Zod schema
    const validation = UpdateMovieSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, year, genre, overview, rating, cardImage, detailImage } = validation.data;

    // Handle image uploads
    let posterThumbUrl: string | undefined = undefined;
    let posterDetailUrl: string | undefined = undefined;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save card image (500×333)
    if (cardImage) {
      try {
        const rawName = cardImage.filename;
        const safeName = rawName.replace(/[^a-z0-9.\-_]/gi, '_');
        const unique = `${Date.now()}-card-${safeName}`;
        const filePath = path.join(uploadsDir, unique);
        const buffer = Buffer.from(cardImage.data, 'base64');
        await fs.writeFile(filePath, buffer);
        posterThumbUrl = `/uploads/${unique}`;
      } catch (e) {
        console.error('Failed to write card image:', e);
      }
    }

    // Save detail image (1000×667)
    if (detailImage) {
      try {
        const rawName = detailImage.filename;
        const safeName = rawName.replace(/[^a-z0-9.\-_]/gi, '_');
        const unique = `${Date.now()}-detail-${safeName}`;
        const filePath = path.join(uploadsDir, unique);
        const buffer = Buffer.from(detailImage.data, 'base64');
        await fs.writeFile(filePath, buffer);
        posterDetailUrl = `/uploads/${unique}`;
      } catch (e) {
        console.error('Failed to write detail image:', e);
      }
    }

    const client = await clientPromise;
    const db = client.db();

    const update: any = {
      title,
      year,
      genre,
      overview,
      rating,
    };

    if (posterThumbUrl) {
      update.posterThumbUrl = posterThumbUrl;
    }

    if (posterDetailUrl) {
      update.posterDetailUrl = posterDetailUrl;
    }

    const result = await db.collection("movies").updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}
