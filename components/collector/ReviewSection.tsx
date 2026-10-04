import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

type ReviewSectionProps = {
  label: string;
  onEdit: () => void;
  children: ReactNode;
};

// One labelled block on the "Please check your details" page, with an edit pencil.
export default function ReviewSection({ label, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line-soft pb-4 last:border-b-0">
      <div>
        <p className="text-base font-semibold text-brand">{label}</p>
        <div className="mt-1 text-xl text-ink">{children}</div>
      </div>
      <button
        type="button"
        aria-label={`Edit ${label}`}
        onClick={onEdit}
        className="rounded p-1 text-subtle hover:bg-surface hover:text-ink"
      >
        <Pencil size="1.125rem" />
      </button>
    </div>
  );
}
