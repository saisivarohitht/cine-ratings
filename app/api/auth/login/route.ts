import { NextResponse } from 'next/server';
import { createSession, authenticateUser } from '@/lib/auth';
import { AuthLoginSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = AuthLoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid login details' },
        { status: 400 }
      );
    }

    const user = await authenticateUser({
      username: validation.data.username,
      password: validation.data.password,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
