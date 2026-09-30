import DateInput from "@/components/ui/DateInput";

type ExportDateFilterProps = {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function ExportDateFilter({
  start,
  end,
  onStartChange,
  onEndChange,
  onApply,
  onClear,
}: ExportDateFilterProps) {
  const invalid = start !== "" && end !== "" && start > end;
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-xl bg-surface px-5 py-4 shadow-sm">
      <span className="text-[0.95rem] font-medium uppercase tracking-wide text-label">Last exported:</span>
      <DateInput id="export-start" label="Start" value={start} max={end || undefined} onChange={(e) => onStartChange(e.target.value)} />
      <DateInput id="export-end" label="End" value={end} min={start || undefined} onChange={(e) => onEndChange(e.target.value)} />
      {invalid && <span className="text-base text-fail">Start date must be before end date.</span>}
      <div className="ml-auto flex items-center gap-5 text-lg">
        <button
          type="button"
          disabled={invalid}
          onClick={onApply}
          className="font-semibold text-ink hover:text-brand disabled:cursor-not-allowed disabled:text-muted"
        >
          Apply Filters
        </button>
        <button type="button" onClick={onClear} className="text-subtle hover:text-ink">
          Clear
        </button>
      </div>
    </div>
  );
}
