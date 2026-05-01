import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewEditForm } from "@/components/ReviewEditForm";
import { getReviewById } from "@/lib/review-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12 text-white lg:px-8">
      <Link href={`/reviews?movieId=${review.movieId}`} className="text-sm text-amber-300 hover:text-amber-200">
        Back to reviews
      </Link>

      <ReviewEditForm review={review} />
    </main>
  );
}
