"use client";

import { Download } from "lucide-react";
import { useCallback, useState } from "react";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import Toast from "@/components/ui/Toast";
import { downloadCsv } from "@/lib/download";
import {
  buildCsv,
  EXPORT_BATCHES,
  exportFilename,
  formatDateTime,
  MANUAL_EXPORT_ROWS,
  nowIso,
  type ExportBatch,
} from "@/lib/manual-export-data";
import AvReferenceDialog from "./AvReferenceDialog";
import BatchTable, { type BatchRow } from "./BatchTable";
import ExportConfirmDialog from "./ExportConfirmDialog";
import ExportDateFilter from "./ExportDateFilter";
import ExportTable, { type ExportTableRow } from "./ExportTable";

type Tab = "ready" | "awaiting" | "completed";

// Compare on the date part of the ISO string (YYYY-MM-DD)
const inRange = (iso: string, start: string, end: string) => {
  const day = iso.slice(0, 10);
  return (start === "" || day >= start) && (end === "" || day <= end);
};

export default function ManualExportView() {
  const [rows, setRows] = useState(MANUAL_EXPORT_ROWS);
  const [batches, setBatches] = useState<ExportBatch[]>(EXPORT_BATCHES);
  const [tab, setTab] = useState<Tab>("ready");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [applied, setApplied] = useState({ start: "", end: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [avBatch, setAvBatch] = useState<{ id: string; justExported: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const batchById = new Map(batches.map((b) => [b.id, b]));
  const rowsIn = (ids: number[]) => rows.filter((r) => ids.includes(r.id));
  const sum = (list: { amount: number }[]) => list.reduce((s, r) => s + r.amount, 0);

  const ready = rows.filter((r) => !r.batchId);
  const awaiting: BatchRow[] = batches
    .filter((b) => !b.avReference)
    .sort((a, b) => b.exportedAt.localeCompare(a.exportedAt))
    .map((b) => ({ ...b, total: sum(rowsIn(b.payoutIds)) }));
  const completed: ExportTableRow[] = rows
    .flatMap((r) => {
      const b = r.batchId ? batchById.get(r.batchId) : undefined;
      return b?.avReference ? [{ ...r, exportedAt: b.exportedAt, avReference: b.avReference }] : [];
    })
    .filter((r) => inRange(r.exportedAt, applied.start, applied.end))
    .sort((a, b) => b.exportedAt.localeCompare(a.exportedAt));

  const shownCount = tab === "ready" ? ready.length : tab === "awaiting" ? awaiting.length : completed.length;

  function download(list: typeof rows) {
    downloadCsv(exportFilename(), buildCsv(list));
  }

  // Export all ready payouts as a new batch, then prompt for the AV reference.
  function exportReady() {
    const id = `B-${Date.now()}`;
    const ids = ready.map((r) => r.id);
    setBatches((prev) => [...prev, { id, exportedAt: nowIso(), avReference: null, payoutIds: ids }]);
    setRows((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, batchId: id } : r)));
    download(ready);
    setConfirmOpen(false);
    setAvBatch({ id, justExported: true });
  }

  const dialogBatch = avBatch ? batchById.get(avBatch.id) : undefined;
  const dialogRows = dialogBatch ? rowsIn(dialogBatch.payoutIds) : [];

  return (
    <div>
      <h1 className="text-[2.1rem] font-semibold leading-[2.6rem] text-title-navy">Manual Bank Transfer Export</h1>
      <p className="mt-1 text-lg text-label">
        Export authorised Manual Bank Transfer payouts that have served the venue payment delay.
      </p>

      <div className="mt-[1.9rem]">
        <Tabs
          tabs={[
            { id: "ready", label: "Ready to Export", count: ready.length },
            { id: "awaiting", label: "Awaiting AV Reference", count: awaiting.length },
            { id: "completed", label: "Completed" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "completed" && (
        <div className="mt-[1.5rem]">
          <ExportDateFilter
            start={start}
            end={end}
            onStartChange={setStart}
            onEndChange={setEnd}
            onApply={() => setApplied({ start, end })}
            onClear={() => {
              setStart("");
              setEnd("");
              setApplied({ start: "", end: "" });
            }}
          />
        </div>
      )}

      <div className="mt-[1.3rem] flex min-h-[2.9rem] items-center justify-end gap-3">
        <span className="mr-2 text-lg text-subtle">
          Showing {shownCount} {tab === "awaiting" ? "exports" : "results"}
        </span>
        {tab !== "awaiting" && (
          <Button
            variant="ghost"
            disabled={shownCount === 0}
            className="h-[2.9rem] gap-2 border-line! px-5 text-lg! font-medium! disabled:cursor-not-allowed disabled:text-muted"
            onClick={() => {
              if (tab === "ready") {
                setConfirmOpen(true);
              } else {
                // Re-download only: export time and AV reference stay fixed
                download(completed);
                setToast(`Downloaded ${completed.length} completed payouts.`);
              }
            }}
          >
            <Download size="1.2rem" strokeWidth={2} /> Export CSV
          </Button>
        )}
      </div>

      <div className="mt-[1.3rem]">
        {tab === "awaiting" ? (
          <BatchTable
            batches={awaiting}
            onEnterReference={(id) => setAvBatch({ id, justExported: false })}
            onRedownload={(id) => {
              const b = batchById.get(id)!;
              download(rowsIn(b.payoutIds));
              setToast(`Re-downloaded export from ${formatDateTime(b.exportedAt)}.`);
            }}
          />
        ) : (
          <ExportTable
            rows={tab === "ready" ? ready : completed}
            showExportInfo={tab === "completed"}
            emptyText={
              tab === "ready"
                ? "No Manual Bank Transfer payouts are ready to export."
                : "No completed payouts match these dates."
            }
          />
        )}
      </div>

      <ExportConfirmDialog
        open={confirmOpen}
        count={ready.length}
        total={sum(ready)}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={exportReady}
      />
      <AvReferenceDialog
        open={!!dialogBatch}
        count={dialogRows.length}
        total={sum(dialogRows)}
        exportedAt={dialogBatch ? formatDateTime(dialogBatch.exportedAt) : ""}
        justExported={avBatch?.justExported ?? false}
        onLater={() => {
          if (avBatch?.justExported) {
            setToast("Export saved. Enter the AV reference later under Awaiting AV Reference.");
          }
          setAvBatch(null);
        }}
        onSave={(reference) => {
          setBatches((prev) => prev.map((b) => (b.id === avBatch!.id ? { ...b, avReference: reference } : b)));
          setToast(`AV reference ${reference} saved. ${dialogRows.length} payouts moved to Payment Completed.`);
          setAvBatch(null);
        }}
      />
      <Toast message={toast} onClose={closeToast} />
    </div>
  );
}
