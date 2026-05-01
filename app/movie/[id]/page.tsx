import Link from "next/link";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12 text-white lg:px-8">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
        Back to home
      </Link>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Movie details
        </p>
        <h1 className="mt-4 text-4xl font-semibold">{id}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          This page will later show the full movie info, user reviews, and the
          rating form connected to MongoDB.
        </p>
      </section>
    </main>
  );
}