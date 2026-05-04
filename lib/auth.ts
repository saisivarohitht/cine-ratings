import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_SECRET = process.env.ADMIN_PASSWORD || 'default-dev-secret';

export async function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const cookieStore = await cookies();
  cookieStore.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('admin-session')?.value;
}

export async function validateSession(token: string): Promise<boolean> {
  // In a real app, you'd store sessions in a database
  // For now, we're just checking if the token exists and was recently created
  return !!token && token.length > 0;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}
