'use client';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export function Pagination({ page, totalPages, onPageChange, isLoading }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isLoading}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4)) + i;
          if (pageNum > totalPages || pageNum < 1) return null;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className={`rounded px-3 py-2 text-sm transition ${
                page === pageNum
                  ? 'bg-amber-300 text-slate-950 font-semibold'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              } disabled:cursor-not-allowed`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isLoading}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>

      <span className="text-sm text-slate-400 ml-4">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
