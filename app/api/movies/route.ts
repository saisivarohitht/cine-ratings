import { getMovies } from "@/lib/movie-data";
import { CreateMovieSchema } from "@/lib/schemas";
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 12));
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('movies');

    // Get total count
    const total = await collection.countDocuments();

    // Get paginated movies
    const moviesData = await collection
      .find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const movies = moviesData.map((movie) => ({
      id: movie._id?.toString() || '',
      title: movie.title || '',
      year: movie.year || 0,
      genre: movie.genre || '',
      rating: movie.rating || 0,
      overview: movie.overview || '',
      posterUrl: movie.posterUrl,
      posterThumbUrl: movie.posterThumbUrl,
      posterDetailUrl: movie.posterDetailUrl,
    }));

    return NextResponse.json(
      {
        movies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate input using Zod schema
    const validation = CreateMovieSchema.safeParse(data);
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
    const movie: any = {
      title,
      year,
      genre,
      overview,
      rating,
    };

    if (posterThumbUrl) {
      movie.posterThumbUrl = posterThumbUrl;
    }

    if (posterDetailUrl) {
      movie.posterDetailUrl = posterDetailUrl;
    }

    const result = await db.collection("movies").insertOne(movie);
    return NextResponse.json({ insertedId: result.insertedId, movie }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
