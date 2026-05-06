'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type LoginMode = 'user' | 'admin';

export function AuthForm() {
  const [mode, setMode] = useState<LoginMode>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, mode }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect based on admin status
      const redirectUrl = data.user?.isAdmin ? '/admin' : '/';
      router.replace(redirectUrl);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  }

  const isAdmin = mode === 'admin';
  const title = isAdmin ? 'Sign in as Admin' : 'Sign in to your Account';
  const description = isAdmin 
    ? 'Enter the admin credentials to manage the app.'
    : 'Access your account to manage your profile and reviews.';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-6 text-slate-400">{description}</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 rounded-full bg-slate-950/40 p-1">
          <button
            type="button"
            onClick={() => setMode('user')}
            disabled={isLoading}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === 'user'
                ? 'bg-amber-300 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setMode('admin')}
            disabled={isLoading}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === 'admin'
                ? 'bg-amber-300 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Admin Login
          </button>
        </div>
      </div>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Username</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={isAdmin ? 'admin' : 'Enter your username'}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="username"
          autoFocus
        />
      </label>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="current-password"
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || !username.trim() || !password.trim()}
        className="w-full rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      {!isAdmin && (
        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-amber-300 transition hover:text-amber-200 font-medium">
              Create one
            </Link>
          </p>
        </div>
      )}

      <p className="text-center text-xs leading-5 text-slate-500">
        {isAdmin 
          ? 'Admin access is required to manage movies and reviews.'
          : 'Public visitors can browse without signing in.'}
      </p>
    </form>
  );
}