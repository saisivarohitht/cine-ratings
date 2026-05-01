"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type MovieEditFormProps = {
  movie: {
    id: string;
    title: string;
    year: number;
    genre: string;
    rating: number;
    overview: string;
    posterUrl: string;
  };
};

export function MovieEditForm({ movie }: MovieEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(movie.title);
  const [year, setYear] = useState(String(movie.year));
  const [genre, setGenre] = useState(movie.genre);
  const [rating, setRating] = useState(String(movie.rating));
  const [overview, setOverview] = useState(movie.overview);
  const [posterUrl, setPosterUrl] = useState(movie.posterUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          year: Number(year),
          genre,
          rating: Number(rating),
          overview,
          posterUrl,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update movie");
      }

      setStatus("Movie updated successfully.");
      router.refresh();
      router.push(`/movie/${movie.id}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">Edit movie</p>
        <h1 className="mt-3 text-3xl font-semibold">Update movie details</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Year</span>
          <input type="number" value={year} onChange={(event) => setYear(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Genre</span>
          <input value={genre} onChange={(event) => setGenre(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Rating</span>
          <input type="number" step="0.1" min="0" max="10" value={rating} onChange={(event) => setRating(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Poster URL</span>
          <input value={posterUrl} onChange={(event) => setPosterUrl(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Overview</span>
          <textarea rows={5} value={overview} onChange={(event) => setOverview(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
        {status ? <p className="text-sm text-slate-300">{status}</p> : null}
      </div>
    </form>
  );
}
