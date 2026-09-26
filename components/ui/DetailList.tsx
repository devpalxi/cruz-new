type DetailListProps = {
  rows: { label: string; value: string }[];
  labelClassName?: string;
};

export default function DetailList({ rows, labelClassName = "font-semibold" }: DetailListProps) {
  return (
    <dl>
      {rows.map((row) => (
        <div key={row.label} className="flex h-[1.875rem] items-center justify-between gap-4 text-xl text-ink">
          <dt className={labelClassName}>{row.label}:</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
