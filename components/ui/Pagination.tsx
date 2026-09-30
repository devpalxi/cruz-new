import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  pages: number;
  current: number;
};

// Visual only for now — buttons do not change pages.
export default function Pagination({ pages, current }: PaginationProps) {
  const cell = "flex h-[2.85rem] items-center justify-center border-l border-line text-lg";
  return (
    <nav aria-label="Pagination" className="inline-flex overflow-hidden rounded-md border border-line bg-surface">
      <button type="button" disabled className="flex h-[2.85rem] items-center gap-1 px-4 text-lg text-muted">
        <ChevronLeft size="1.1rem" /> Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === current ? "page" : undefined}
          className={`${cell} w-[3.6rem] ${n === current ? "bg-focus/10 text-focus" : "text-label hover:bg-page"}`}
        >
          {n}
        </button>
      ))}
      <button type="button" className={`${cell} gap-1 px-4 text-label hover:bg-page`}>
        Next <ChevronRight size="1.1rem" />
      </button>
    </nav>
  );
}
