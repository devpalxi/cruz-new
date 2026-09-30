import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import PayoutStatusPill from "@/components/ui/PayoutStatusPill";
import { formatDateTime, type ExportBatch } from "@/lib/manual-export-data";

export type BatchRow = ExportBatch & { total: number };

type BatchTableProps = {
  batches: BatchRow[];
  onEnterReference: (batchId: string) => void;
  onRedownload: (batchId: string) => void;
};

const headers = ["Exported DateTime", "Payouts", "Payout IDs", "Total Amount", "Status", "Actions"];

export default function BatchTable({ batches, onEnterReference, onRedownload }: BatchTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full min-w-[70rem] text-left">
        <thead className="bg-table-head">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="h-[4.4rem] px-[1.25rem] text-[0.95rem] font-normal uppercase tracking-wide text-subtle first:pl-[1.9rem]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {batches.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-lg text-subtle">
                No exports are waiting for an AV reference.
              </td>
            </tr>
          )}
          {batches.map((b) => (
            <tr key={b.id} className="h-[5.25rem] border-t border-line-soft text-lg text-ink">
              <td className="pl-[1.9rem] pr-[1.25rem]">{formatDateTime(b.exportedAt)}</td>
              <td className="px-[1.25rem]">{b.payoutIds.length}</td>
              <td className="px-[1.25rem] text-label">{b.payoutIds.join(", ")}</td>
              <td className="px-[1.25rem]">${b.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
              <td className="px-[1.25rem]">
                <PayoutStatusPill status="Pending Payment" />
              </td>
              <td className="px-[1.25rem]">
                <div className="flex gap-2">
                  <Button className="h-[2.6rem] whitespace-nowrap px-4" onClick={() => onEnterReference(b.id)}>
                    Enter AV Reference
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Re-download CSV"
                    className="h-[2.6rem] gap-2 whitespace-nowrap border-line! px-4 font-medium!"
                    onClick={() => onRedownload(b.id)}
                  >
                    <Download size="1.1rem" strokeWidth={2} /> CSV
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
