import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  // Set true for columns whose content should be allowed to wrap (e.g. long free-text names).
  wrap?: boolean;
  // Constrains the header's width (e.g. "8rem") so a long label wraps onto multiple lines instead
  // of stretching the column wider than its values need.
  headerMaxWidth?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-soft bg-surface">
      {/* Scrolls horizontally instead of silently clipping columns if content is wider than the container. */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-field">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wide text-subtle"
                >
                  <span style={column.headerMaxWidth ? { display: "inline-block", maxWidth: column.headerMaxWidth } : undefined}>
                    {column.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-10 text-center text-lg text-subtle">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-t border-line-soft">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-8 py-4 text-lg text-ink ${column.align === "right" ? "text-right" : "text-left"} ${
                        column.wrap ? "" : "whitespace-nowrap"
                      }`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
