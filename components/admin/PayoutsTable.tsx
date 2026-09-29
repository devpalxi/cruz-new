import PayoutStatusPill from "@/components/ui/PayoutStatusPill";
import ResultPill from "@/components/ui/ResultPill";
import type { AdminPayoutRow } from "@/lib/admin-data";

const headers = [
  "Payout ID",
  "Created",
  "Venue",
  "ID Match",
  "PEP",
  "Sanction",
  "CoP",
  "Amount",
  "Payment ETA",
  "Status",
  "Actions",
];

// Column widths as a share of the table, measured from the reference
const widths = ["7%", "12.2%", "10.6%", "10.6%", "6.8%", "8.8%", "8.2%", "7.1%", "8.9%", "12.6%", "7.1%"];

export default function PayoutsTable({ rows }: { rows: AdminPayoutRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full min-w-[70rem] table-fixed text-left">
        <colgroup>
          {widths.map((w, i) => (
            <col key={headers[i]} style={{ width: w }} />
          ))}
        </colgroup>
        <thead className="bg-table-head">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="h-[4.4rem] px-[1.5rem] text-[0.95rem] font-normal uppercase leading-[1.25rem] tracking-wide text-subtle first:pl-[1.9rem]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-lg text-subtle">
                No payouts match these filters.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="h-[5.65rem] border-t border-line-soft text-lg text-ink">
              <td className="pl-[1.9rem] pr-[1.5rem]">{row.id}</td>
              <td className="px-[1.5rem] leading-[1.55rem]">
                {row.date}
                <br />
                {row.time}
              </td>
              <td className="px-[1.5rem] leading-[1.55rem]">{row.venue}</td>
              <td className="px-[1.5rem]">
                <ResultPill check={row.idMatch} />
              </td>
              <td className="px-[1.5rem]">
                <ResultPill check={row.pep} />
              </td>
              <td className="px-[1.5rem]">
                <ResultPill check={row.sanction} />
              </td>
              <td className="px-[1.5rem]">
                <ResultPill check={row.cop} />
              </td>
              <td className="px-[1.5rem]">${row.amount}</td>
              <td className="px-[1.5rem]">-</td>
              <td className="px-[1.5rem]">
                <PayoutStatusPill status={row.status} />
              </td>
              <td className="px-[1.5rem] text-muted">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
