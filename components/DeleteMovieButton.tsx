"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteMovieButtonProps = {
  movieId: string;
};

export function DeleteMovieButton({ movieId }: DeleteMovieButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this movie and its reviews?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to delete movie");
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete movie"}
    </button>
  );
}
