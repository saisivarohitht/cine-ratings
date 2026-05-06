import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ResetPasswordForm } from '@/components/ResetPasswordForm';
import { getSession, validateSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const session = await getSession();

  if (await validateSession(session || '')) {
    redirect('/admin');
  }

  const params = searchParams ? await searchParams : undefined;
  const token = params?.token || '';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_34%),linear-gradient(180deg,#050816_0%,#0b1020_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur sm:p-10 lg:p-12">
          <div className="mb-8 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">Reset password</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Choose a new password</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Use the reset link from your email to finish the password change.
            </p>
          </div>

          <ResetPasswordForm token={token} />

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link href="/login" className="text-amber-300 transition hover:text-amber-200">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}