import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json(
      { error: 'Username recovery is disabled for this app.' },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Username recovery is disabled for this app.' },
      { status: 403 }
    );
  }
}