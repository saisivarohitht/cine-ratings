'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();

      if (!data.authenticated) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-white/10 bg-slate-950/50 px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">Admin Panel</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-amber-300 hover:text-amber-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
