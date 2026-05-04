import { NextResponse } from 'next/server';
import { setupDatabaseIndexes } from '@/lib/db-indexes';

export async function POST() {
  try {
    // In production, you might want to add authentication here
    const success = await setupDatabaseIndexes();
    
    if (success) {
      return NextResponse.json(
        { message: 'Database indexes created successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Database indexes already exist or error occurred' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup database indexes' },
      { status: 500 }
    );
  }
}
