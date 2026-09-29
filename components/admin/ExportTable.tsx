import PayoutStatusPill from "@/components/ui/PayoutStatusPill";
import { formatDateTime, type ManualExportRow } from "@/lib/manual-export-data";

const headers = [
  "Payout ID",
  "Venue Code",
  "Bank Transfer Amount",
  "BSB",
  "Account Number",
  "Account Name",
  "Last Exported DateTime",
  "Collection DateTime",
  "Status",
];

type ExportTableProps = {
  rows: ManualExportRow[];
  emptyText: string;
};

export default function ExportTable({ rows, emptyText }: ExportTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full min-w-[70rem] text-left">
        <thead className="bg-table-head">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="h-[4.4rem] px-[1.25rem] text-[0.95rem] font-normal uppercase leading-[1.25rem] tracking-wide text-subtle first:pl-[1.9rem]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-lg text-subtle">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="h-[4.75rem] border-t border-line-soft text-lg text-ink">
              <td className="pl-[1.9rem] pr-[1.25rem]">{row.id}</td>
              <td className="px-[1.25rem]">{row.venueCode}</td>
              <td className="px-[1.25rem]">${row.amount.toFixed(2)}</td>
              <td className="px-[1.25rem] tabular-nums">{row.bsb}</td>
              <td className="px-[1.25rem] tabular-nums">{row.accountNumber}</td>
              <td className="px-[1.25rem]">{row.accountName}</td>
              <td className={`px-[1.25rem] ${row.lastExportedAt ? "" : "text-muted"}`}>
                {formatDateTime(row.lastExportedAt)}
              </td>
              <td className="px-[1.25rem]">{formatDateTime(row.collectedAt)}</td>
              <td className="px-[1.25rem]">
                <PayoutStatusPill status={row.lastExportedAt ? "Payment Completed" : "Pending Payment"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
