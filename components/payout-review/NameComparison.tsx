import { Check } from "lucide-react";
import InsetCard from "@/components/ui/InsetCard";

type NameComparisonProps = {
  idName: string;
  bankName: string;
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

export default function NameComparison({ idName, bankName, match }: NameComparisonProps) {
  return (
    <InsetCard title="Name Verification Comparison">
      <div className="flex items-center gap-4">
        <NameBox label="Name on ID document" value={idName} />
        <div className="flex w-[3.5rem] flex-col items-center gap-1">
          <span className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full border border-success-line bg-success-soft text-success">
            <Check size="1rem" strokeWidth={2} />
          </span>
          <span className="text-[0.75rem] text-success">{match ? "Match" : "No match"}</span>
        </div>
        <NameBox label="Provided bank account name" value={bankName} />
      </div>
    </InsetCard>
  );
}
