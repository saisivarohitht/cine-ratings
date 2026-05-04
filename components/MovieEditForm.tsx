"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";

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
  const [cardFilename, setCardFilename] = useState<string | undefined>(undefined);
  const [cardMime, setCardMime] = useState<string | undefined>(undefined);
  const [cardData, setCardData] = useState<string | undefined>(undefined);
  const [detailFilename, setDetailFilename] = useState<string | undefined>(undefined);
  const [detailMime, setDetailMime] = useState<string | undefined>(undefined);
  const [detailData, setDetailData] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

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
          cardImage: cardData ? { filename: cardFilename, mime: cardMime, data: cardData } : undefined,
          detailImage: detailData ? { filename: detailFilename, mime: detailMime, data: detailData } : undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update movie");
      }

      showToast("Movie updated successfully!", "success");
      router.refresh();
      router.push(`/movie/${movie.id}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
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
                  setCardFilename(file.name);
                  setCardMime(mime);
                  setCardData(data);
                };
                reader.readAsDataURL(file);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
            />

            {cardData ? (
              <div className="flex items-center gap-3">
                <img src={`data:${cardMime};base64,${cardData}`} alt="card preview" className="h-20 w-32 rounded object-cover" />
                <button type="button" onClick={() => { setCardFilename(undefined); setCardMime(undefined); setCardData(undefined); }} className="text-sm text-amber-300 hover:text-amber-200">Remove</button>
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
                  setDetailFilename(file.name);
                  setDetailMime(mime);
                  setDetailData(data);
                };
                reader.readAsDataURL(file);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
            />

            {detailData ? (
              <div className="flex items-center gap-3">
                <img src={`data:${detailMime};base64,${detailData}`} alt="detail preview" className="h-20 w-32 rounded object-cover" />
                <button type="button" onClick={() => { setDetailFilename(undefined); setDetailMime(undefined); setDetailData(undefined); }} className="text-sm text-amber-300 hover:text-amber-200">Remove</button>
              </div>
            ) : null}
          </div>
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
      </div>
    </form>
  );
}
