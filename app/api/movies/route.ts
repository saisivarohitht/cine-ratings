import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const movies = await db.collection('movies').find({}).limit(100).toArray();
    return NextResponse.json(movies);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('movies').insertOne(data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
