import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export default function WarningBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[1.9375rem] items-center gap-1.5 rounded-full border border-warn-line bg-warn-bg px-4 text-sm font-semibold text-warn-ink">
      <TriangleAlert size="1rem" strokeWidth={1.75} />
      {children}
    </span>
  );
}
