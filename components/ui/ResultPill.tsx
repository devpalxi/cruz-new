import type { Check } from "@/lib/admin-data";

// Renders a verification result cell (ID Match / PEP / Sanction / CoP).
export default function ResultPill({ check }: { check: Check }) {
  switch (check.kind) {
    case "none":
      return <span className="text-muted">-</span>;
    case "text":
      return <span className="text-[0.95rem] leading-[1.55rem] text-ink">{check.value}</span>;
    case "fail":
      return <span className="text-[0.95rem] font-medium text-fail">Fail</span>;
    case "closeMatch":
      return (
        <span className="text-[0.95rem] font-medium leading-[1.55rem] text-close-match">
          Close
          <br />
          Match
        </span>
      );
    case "pass":
      return (
        <span className="inline-flex h-[1.65rem] items-center gap-1 rounded-full border border-success-line bg-success-soft px-2.5 text-[0.95rem] text-success">
          <span aria-hidden>✓</span>
          {check.value}
        </span>
      );
  }
}
