import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignupForm } from '@/components/SignupForm';
import { getSession, validateSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const session = await getSession();

  if (await validateSession(session || '')) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_34%),linear-gradient(180deg,#050816_0%,#0b1020_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <section className="flex flex-col justify-between rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur sm:p-10 lg:p-12">
            <div className="max-w-xl space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">Create Account</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Join Cine Ratings
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                Create your account to start managing reviews and ratings. Browse movies and share your thoughts with the community.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-medium text-white">Write Reviews</p>
                <p className="mt-1 text-slate-400">Share your movie ratings and thoughts.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-medium text-white">Secure Account</p>
                <p className="mt-1 text-slate-400">Your data is protected with hashed passwords.</p>
              </div>
            </div>
          </section>

          <section className="flex items-center rounded-4xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
            <div className="w-full">
              <SignupForm />

              <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-300 transition hover:text-amber-200 font-medium">
                  Sign in
                </Link>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}