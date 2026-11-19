import type { ReactNode } from "react";

// Marks text in an email preview that changes with the payout type (prototype only)
export default function TypeText({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-warn-bg px-1 font-semibold text-warn-ink">{children}</mark>;
}
