import Link from "next/link";
import { notFound } from "next/navigation";

import { MovieEditForm } from "@/components/MovieEditForm";
import { getMovieById } from "@/lib/movie-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMoviePage({ params }: PageProps) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12 text-white lg:px-8">
      <Link href="/admin" className="text-sm text-amber-300 hover:text-amber-200">
        Back to admin
      </Link>

      <MovieEditForm movie={movie} />
    </main>
  );
}
