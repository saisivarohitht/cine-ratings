import { NextResponse } from 'next/server';
import { getSession, getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    const user = await getSessionUser(session || '');

    return NextResponse.json(
      { authenticated: Boolean(user), user },
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
