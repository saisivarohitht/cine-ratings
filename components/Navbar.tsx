import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#0b1020]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          ReelRater
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/reviews" className="transition hover:text-white">
            Reviews
          </Link>
        </nav>
      </div>
    </header>
  );
}