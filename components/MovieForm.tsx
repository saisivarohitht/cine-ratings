"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type MovieFormState = {
  title: string;
  year: string;
  genre: string;
  rating: string;
  overview: string;
  posterUrl: string;
};

const initialState: MovieFormState = {
  title: "",
  year: "2024",
  genre: "Drama",
  rating: "8",
  overview: "",
  posterUrl: "",
};

export function MovieForm() {
  const router = useRouter();
  const [form, setForm] = useState<MovieFormState>(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          year: Number(form.year),
          genre: form.genre,
          rating: Number(form.rating),
          overview: form.overview,
          posterUrl: form.posterUrl,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        insertedId?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create movie");
      }

      setForm(initialState);
      setStatus("Movie added successfully.");

      if (data.insertedId) {
        router.push(`/movie/${data.insertedId}`);
        router.refresh();
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">
          Add a movie
        </p>
        <h2 className="mt-3 text-3xl font-semibold">Create a new movie entry</h2>
        <p className="mt-2 text-sm text-slate-400">
          This will save directly to MongoDB and appear on the homepage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Movie title"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Year</span>
          <input
            type="number"
            value={form.year}
            onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Genre</span>
          <input
            value={form.genre}
            onChange={(event) => setForm((current) => ({ ...current, genre: event.target.value }))}
            placeholder="Action, Drama, Sci-Fi..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Rating</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.rating}
            onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Poster URL</span>
          <input
            value={form.posterUrl}
            onChange={(event) => setForm((current) => ({ ...current, posterUrl: event.target.value }))}
            placeholder="https://..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Overview</span>
          <textarea
            value={form.overview}
            onChange={(event) => setForm((current) => ({ ...current, overview: event.target.value }))}
            rows={5}
            placeholder="Short summary of the movie..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save movie"}
        </button>
        {status ? <p className="text-sm text-slate-300">{status}</p> : null}
      </div>
    </form>
  );
}
