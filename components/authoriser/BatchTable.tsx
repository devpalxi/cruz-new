"use client";

import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "@/components/ui/Button";
import PayoutStatusPill from "@/components/ui/PayoutStatusPill";
import { formatDateTime, type ExportBatch, type ManualExportRow } from "@/lib/manual-export-data";
import BatchPayoutsTable from "./BatchPayoutsTable";

export type BatchRow = ExportBatch & { total: number; payouts: ManualExportRow[] };

type BatchTableProps = {
  batches: BatchRow[];
  onEnterReference: (batchId: string) => void;
  onRedownload: (batchId: string) => void;
};

const headers = ["", "Exported DateTime", "Payouts", "Payout IDs", "Total Amount", "Status", "Actions"];
const PREVIEW_IDS = 3;

export default function BatchTable({ batches, onEnterReference, onRedownload }: BatchTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full min-w-[70rem] text-left">
        <thead className="bg-table-head">
          <tr>
            {headers.map((h, i) => (
              <th
                key={h || i}
                className="h-[4.4rem] px-[1.25rem] text-[0.95rem] font-normal uppercase tracking-wide text-subtle first:w-[1%] first:pl-[1.25rem] first:pr-0"
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
                No exports are waiting for an ABA reference.
              </td>
            </tr>
          )}
          {batches.map((b) => {
            const open = expanded.has(b.id);
            const hidden = b.payoutIds.length - PREVIEW_IDS;
            // Single-payout batches have nothing extra to show, so no expand controls
            const expandable = b.payoutIds.length > 1;
            const detailsId = `batch-${b.id}-payouts`;
            const Chevron = open ? ChevronDown : ChevronRight;
            return (
              <Fragment key={b.id}>
                <tr className="h-[5.25rem] border-t border-line-soft text-lg text-ink">
                  <td className="pl-[1.25rem]">
                    {expandable && (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={detailsId}
                      aria-label={`${open ? "Hide" : "Show"} payouts in this export`}
                      onClick={() => toggle(b.id)}
                      className="flex h-8 w-8 items-center justify-center rounded text-subtle hover:bg-page hover:text-ink"
                    >
                      <Chevron size="1.25rem" strokeWidth={2} />
                    </button>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-[1.25rem]">{formatDateTime(b.exportedAt)}</td>
                  <td className="px-[1.25rem]">{b.payoutIds.length}</td>
                  <td className="whitespace-nowrap px-[1.25rem] text-label">
                    {b.payoutIds.slice(0, PREVIEW_IDS).join(", ")}
                    {expandable && (
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={detailsId}
                        onClick={() => toggle(b.id)}
                        className="ml-2 rounded-full bg-line-soft px-2.5 py-0.5 text-[0.95rem] text-label hover:bg-line"
                      >
                        {open ? "Show less" : hidden > 0 ? `+${hidden} more` : "View details"}
                      </button>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-[1.25rem]">
                    ${b.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-[1.25rem]">
                    <PayoutStatusPill status="Awaiting ABA Reference" />
                  </td>
                  <td className="px-[1.25rem]">
                    <div className="flex gap-2">
                      <Button className="h-[2.6rem] whitespace-nowrap px-4" onClick={() => onEnterReference(b.id)}>
                        Enter ABA Reference
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
                {open && expandable && (
                  <tr id={detailsId} className="bg-page/60">
                    <td />
                    <td colSpan={headers.length - 1} className="px-[1.25rem] pb-5 pt-3">
                      <BatchPayoutsTable payouts={b.payouts} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
