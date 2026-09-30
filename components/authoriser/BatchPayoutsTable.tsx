import type { ManualExportRow } from "@/lib/manual-export-data";

const headers = ["Payout ID", "Venue Code", "Amount", "BSB", "Account Number", "Account Name"];

// Payouts inside one export batch, shown when a batch row is expanded.
export default function BatchPayoutsTable({ payouts }: { payouts: ManualExportRow[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className="pb-2 pr-6 text-[0.85rem] font-normal uppercase tracking-wide text-subtle"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {payouts.map((p) => (
          <tr key={p.id} className="border-t border-line-soft text-base text-ink">
            <td className="py-2.5 pr-6">{p.id}</td>
            <td className="py-2.5 pr-6">{p.venueCode}</td>
            <td className="whitespace-nowrap py-2.5 pr-6">${p.amount.toFixed(2)}</td>
            <td className="whitespace-nowrap py-2.5 pr-6 tabular-nums">{p.bsb}</td>
            <td className="whitespace-nowrap py-2.5 pr-6 tabular-nums">{p.accountNumber}</td>
            <td className="py-2.5 pr-6">{p.accountName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
