import { NextResponse } from 'next/server';
import { getSession, validateSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    const isAuthenticated = await validateSession(session || '');

    return NextResponse.json(
      { authenticated: isAuthenticated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}
