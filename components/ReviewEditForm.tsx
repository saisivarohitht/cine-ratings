"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";

type ReviewEditFormProps = {
  review: {
    id: string;
    movieId: string;
    movieTitle: string;
    rating: number;
    text: string;
    author: string;
  };
};

export function ReviewEditForm({ review }: ReviewEditFormProps) {
  const router = useRouter();
  const [author, setAuthor] = useState(review.author);
  const [rating, setRating] = useState(String(review.rating));
  const [text, setText] = useState(review.text);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author,
          rating: Number(rating),
          text,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update review");
      }

      showToast("Review updated successfully!", "success");
      router.refresh();
      router.push(`/reviews?movieId=${review.movieId}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300/90">Edit review</p>
        <h1 className="mt-3 text-3xl font-semibold">Update review for {review.movieTitle}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Your name</span>
          <input value={author} onChange={(event) => setAuthor(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Rating</span>
          <input type="number" min={1} max={10} value={rating} onChange={(event) => setRating(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-300">
        <span>Review</span>
        <textarea rows={5} value={text} onChange={(event) => setText(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50" />
      </label>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
