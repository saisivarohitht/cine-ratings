import { NextResponse } from 'next/server';
import { createSession, createUser } from '@/lib/auth';
import { AuthSignupSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = AuthSignupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid signup details' },
        { status: 400 }
      );
    }

    const user = await createUser({
      username: validation.data.username,
      email: validation.data.email,
      password: validation.data.password,
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create account';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}