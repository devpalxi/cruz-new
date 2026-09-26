type DetailListProps = {
  rows: { label: string; value: string }[];
};

export default function DetailList({ rows }: DetailListProps) {
  return (
    <dl>
      {rows.map((row) => (
        <div key={row.label} className="flex h-[1.875rem] items-center justify-between gap-4 text-xl text-ink">
          <dt className="font-semibold">{row.label}:</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
