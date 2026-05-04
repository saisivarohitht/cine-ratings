"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";

type MovieFormState = {
  title: string;
  year: string;
  genre: string;
  rating: string;
  overview: string;
  // card image (500x333)
  cardFilename?: string;
  cardMime?: string;
  cardData?: string;
  // detail image (1000x667)
  detailFilename?: string;
  detailMime?: string;
  detailData?: string;
};

const initialState: MovieFormState = {
  title: "",
  year: "2024",
  genre: "Drama",
  rating: "8",
  overview: "",
  cardFilename: undefined,
  cardMime: undefined,
  cardData: undefined,
  detailFilename: undefined,
  detailMime: undefined,
  detailData: undefined,
};

export function MovieForm() {
  const router = useRouter();
  const [form, setForm] = useState<MovieFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

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
          cardImage: form.cardData
            ? { filename: form.cardFilename, mime: form.cardMime, data: form.cardData }
            : undefined,
          detailImage: form.detailData
            ? { filename: form.detailFilename, mime: form.detailMime, data: form.detailData }
            : undefined,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        insertedId?: string;
        errors?: any;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create movie");
      }

      setForm(initialState);
      showToast("Movie added successfully!", "success");

      if (data.insertedId) {
        router.push(`/movie/${data.insertedId}`);
        router.refresh();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
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
          <span>Card image (500×333)</span>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string | null;
                  if (!result) return;
                  const comma = result.indexOf(",");
                  const meta = result.substring(5, comma);
                  const mime = meta.split(";")[0];
                  const data = result.substring(comma + 1);
                  setForm((current) => ({
                    ...current,
                    cardFilename: file.name,
                    cardMime: mime,
                    cardData: data,
                  }));
                };
                reader.readAsDataURL(file);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
            />

            {form.cardData ? (
              <div className="flex items-center gap-3">
                <img
                  src={`data:${form.cardMime};base64,${form.cardData}`}
                  alt="card preview"
                  className="h-20 w-32 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, cardFilename: undefined, cardMime: undefined, cardData: undefined }))
                  }
                  className="text-sm text-amber-300 hover:text-amber-200"
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>
        </label>

        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Detail image (1000×667)</span>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string | null;
                  if (!result) return;
                  const comma = result.indexOf(",");
                  const meta = result.substring(5, comma);
                  const mime = meta.split(";")[0];
                  const data = result.substring(comma + 1);
                  setForm((current) => ({
                    ...current,
                    detailFilename: file.name,
                    detailMime: mime,
                    detailData: data,
                  }));
                };
                reader.readAsDataURL(file);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
            />

            {form.detailData ? (
              <div className="flex items-center gap-3">
                <img
                  src={`data:${form.detailMime};base64,${form.detailData}`}
                  alt="detail preview"
                  className="h-20 w-32 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, detailFilename: undefined, detailMime: undefined, detailData: undefined }))
                  }
                  className="text-sm text-amber-300 hover:text-amber-200"
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>
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
      </div>
    </form>
  );
}
