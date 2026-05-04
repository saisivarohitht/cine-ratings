"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";

type ReviewFormProps = {
  movieId: string;
};

export function ReviewForm({ movieId }: ReviewFormProps) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(8);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          rating,
          text,
          author: author || undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setAuthor("");
      setRating(8);
      setText("");
      showToast("Review posted successfully!", "success");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <h3 className="text-xl font-semibold text-white">Write a review</h3>
        <p className="mt-1 text-sm text-slate-400">
          Share what you thought about this movie.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Your name</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Anonymous"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Rating</span>
          <input
            type="number"
            min={1}
            max={10}
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-300">
        <span>Review</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          placeholder="Tell us what you liked or didn't like..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-amber-300/50"
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Posting..." : "Post review"}
        </button>
      </div>
    </form>
  );
}
