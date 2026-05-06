import { NextResponse } from 'next/server';

import { resetPasswordWithToken } from '@/lib/auth';
import { PasswordResetSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = PasswordResetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid reset details' },
        { status: 400 }
      );
    }

    const user = await resetPasswordWithToken(validation.data.token, validation.data.password);

    return NextResponse.json(
      { success: true, message: 'Password updated successfully', user },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reset password';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}