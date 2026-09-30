import { Check, TriangleAlert } from "lucide-react";
import InsetCard from "@/components/ui/InsetCard";

type NameComparisonProps = {
  idName: string;
  otherName: string;
  // Label for the right-hand box — varies by destination (bank account name, cheque bearer name, ...).
  otherLabel?: string;
  match: boolean;
};

function NameBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[4.8125rem] flex-1 flex-col items-center justify-center rounded-md border border-line-soft bg-field">
      <span className="text-[0.75rem] font-medium uppercase tracking-wide text-subtle">{label}</span>
      <span className="mt-1 text-lg font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function NameComparison({
  idName,
  otherName,
  otherLabel = "Provided bank account name",
  match,
}: NameComparisonProps) {
  return (
    <InsetCard title="Name Verification Comparison">
      <div className="flex items-center gap-4">
        <NameBox label="Name on ID document" value={idName} />
        <div className="flex w-[3.5rem] flex-col items-center gap-1">
          <span
            className={`flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full border ${
              match
                ? "border-[#4daa9e80] bg-[#4daa9e1a] text-[#2b2e33]"
                : "border-warn-line bg-warn-bg text-warn-ink"
            }`}
          >
            {match ? <Check size="1rem" strokeWidth={2} /> : <TriangleAlert size="1rem" strokeWidth={2} />}
          </span>
          <span className={`text-[0.75rem] ${match ? "text-[#2b2e33]" : "text-warn-ink"}`}>
            {match ? "Match" : "Different"}
          </span>
        </div>
        <NameBox label={otherLabel} value={otherName} />
      </div>
      {!match && (
        <p className="mt-4 text-[0.9375rem] leading-5 text-label">
          The names do not match exactly. The approver should review and determine if the difference is acceptable.
        </p>
      )}
    </InsetCard>
  );
}
