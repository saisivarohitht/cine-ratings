'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.replace('/signup');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#0b1020]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href={isAuthenticated ? "/" : "/signup"} className="text-lg font-semibold tracking-tight text-white">
          CineRatings
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          {isAuthenticated ? (
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
          ) : null}
          <Link href="/reviews" className="transition hover:text-white">
            Reviews
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-amber-300 transition hover:text-amber-200"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="transition hover:text-white">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}