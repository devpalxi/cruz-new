import { ChevronDown } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import { PAYOUT_STATUSES } from "@/lib/admin-data";

type PayoutFiltersProps = {
  status: string;
  onStatusChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function PayoutFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  onApply,
  onClear,
}: PayoutFiltersProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface px-5 py-4 shadow-sm">
      <span className="text-[0.95rem] font-medium uppercase tracking-wide text-label">Filters:</span>
      <div className="relative">
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-[3.1rem] cursor-pointer appearance-none rounded-full border border-line bg-surface pl-5 pr-11 text-lg text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus"
        >
          <option value="">Status: All</option>
          {PAYOUT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          size="1.1rem"
          strokeWidth={2}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-subtle"
        />
      </div>
      <SearchInput
        aria-label="Search payouts"
        placeholder="Search payout ID, venue.."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onApply()}
        className="w-[17.5rem]"
      />
      <div className="ml-auto flex items-center gap-5 text-lg">
        <button type="button" onClick={onApply} className="font-semibold text-ink hover:text-brand">
          Apply Filters
        </button>
        <button type="button" onClick={onClear} className="text-subtle hover:text-ink">
          Clear
        </button>
      </div>
    </div>
  );
}
