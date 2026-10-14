// One name in a comparison, with a small label above it
export default function NameBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[4.8125rem] flex-1 flex-col items-center justify-center rounded-md border border-line-soft bg-field">
      <span className="text-[0.75rem] font-medium uppercase tracking-wide text-subtle">{label}</span>
      <span className="mt-1 text-lg font-semibold text-ink">{value}</span>
    </div>
  );
}
