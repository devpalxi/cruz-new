import PayoutStatusPill from "@/components/ui/PayoutStatusPill";
import { formatDateTime, type ManualExportRow } from "@/lib/manual-export-data";

export type ExportTableRow = ManualExportRow & { exportedAt?: string; abaReference?: string };

const baseHeaders = [
  "Payout ID",
  "Venue Code",
  "Amount",
  "BSB",
  "Account Number",
  "Account Name",
  "Collection DateTime",
];

type ExportTableProps = {
  rows: ExportTableRow[];
  emptyText: string;
  // Completed tab shows the recorded ABA reference + export time
  showExportInfo?: boolean;
};

export default function ExportTable({ rows, emptyText, showExportInfo = false }: ExportTableProps) {
  const headers = [...baseHeaders, ...(showExportInfo ? ["ABA Reference", "Exported DateTime"] : []), "Status"];
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
              <td className="w-[1%] whitespace-nowrap px-[1.25rem]">${row.amount.toFixed(2)}</td>
              <td className="whitespace-nowrap px-[1.25rem] tabular-nums">{row.bsb}</td>
              <td className="whitespace-nowrap px-[1.25rem] tabular-nums">{row.accountNumber}</td>
              <td className="px-[1.25rem]">{row.accountName}</td>
              <td className="whitespace-nowrap px-[1.25rem]">{formatDateTime(row.collectedAt)}</td>
              {showExportInfo && (
                <>
                  <td className="whitespace-nowrap px-[1.25rem] font-medium">{row.abaReference}</td>
                  <td className="whitespace-nowrap px-[1.25rem]">{formatDateTime(row.exportedAt ?? null)}</td>
                </>
              )}
              <td className="px-[1.25rem]">
                <PayoutStatusPill status={row.abaReference ? "Payment Completed" : "Pending Payment"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
