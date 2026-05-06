'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, confirmPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Regular users go to home page, not admin panel
      router.replace('/');
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Create Your Account</h2>
        <p className="text-sm leading-6 text-slate-400">Fill in the form below to get started.</p>
      </div>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="email"
          autoFocus
          required
        />
      </label>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Username</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Choose a username"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="username"
          required
        />
      </label>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="new-password"
          required
        />
      </label>

      <label className="block space-y-2 text-sm text-slate-300">
        <span>Confirm Password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm your password"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50"
          disabled={isLoading}
          autoComplete="new-password"
          required
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()}
        className="w-full rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        By signing up, you agree to browse and write reviews on Cine Ratings.
      </p>
    </form>
  );
}
