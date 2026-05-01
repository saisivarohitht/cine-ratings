import Link from "next/link";

import { MovieForm } from "@/components/MovieForm";

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12 text-white lg:px-8">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
        Back to home
      </Link>

      <MovieForm />
    </main>
  );
}
