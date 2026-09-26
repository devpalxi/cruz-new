import type { ReactNode } from "react";

type InsetCardProps = {
  title?: string;
  children: ReactNode;
};

// Grey inset panel used inside expanded sections (comparison, screening, history).
export default function InsetCard({ title, children }: InsetCardProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-page px-[1.5625rem] py-5">
      {title && <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>}
      {children}
    </div>
  );
}
