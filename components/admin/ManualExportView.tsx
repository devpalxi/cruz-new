"use client";

import { Download } from "lucide-react";
import { useCallback, useState } from "react";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import Toast from "@/components/ui/Toast";
import { downloadCsv } from "@/lib/download";
import { buildCsv, exportFilename, MANUAL_EXPORT_ROWS, nowIso } from "@/lib/manual-export-data";
import ExportConfirmDialog from "./ExportConfirmDialog";
import ExportDateFilter from "./ExportDateFilter";
import ExportTable from "./ExportTable";

type Tab = "ready" | "exported";

// Compare on the date part of the ISO string (YYYY-MM-DD)
const inRange = (iso: string, start: string, end: string) => {
  const day = iso.slice(0, 10);
  return (start === "" || day >= start) && (end === "" || day <= end);
};

export default function ManualExportView() {
  const [rows, setRows] = useState(MANUAL_EXPORT_ROWS);
  const [tab, setTab] = useState<Tab>("ready");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [applied, setApplied] = useState({ start: "", end: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Rows just re-downloaded stay visible until the filter is re-applied, even if their new timestamp is out of range
  const [pinned, setPinned] = useState<number[]>([]);
  const closeToast = useCallback(() => setToast(null), []);

  const ready = rows.filter((r) => !r.lastExportedAt);
  const exported = rows
    .filter(
      (r) => r.lastExportedAt && (pinned.includes(r.id) || inRange(r.lastExportedAt, applied.start, applied.end)),
    )
    .sort((a, b) => b.lastExportedAt!.localeCompare(a.lastExportedAt!));
  const shown = tab === "ready" ? ready : exported;
  const readyTotal = ready.reduce((sum, r) => sum + r.amount, 0);

  // Stamp the given rows with "now" and download them.
  function exportRows(ids: number[]) {
    const stamp = nowIso();
    const next = rows.map((r) => (ids.includes(r.id) ? { ...r, lastExportedAt: stamp } : r));
    setRows(next);
    downloadCsv(exportFilename(), buildCsv(next.filter((r) => ids.includes(r.id))));
  }

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
            { id: "exported", label: "Previously Exported" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "exported" && (
        <div className="mt-[1.5rem]">
          <ExportDateFilter
            start={start}
            end={end}
            onStartChange={setStart}
            onEndChange={setEnd}
            onApply={() => {
              setApplied({ start, end });
              setPinned([]);
            }}
            onClear={() => {
              setStart("");
              setEnd("");
              setApplied({ start: "", end: "" });
              setPinned([]);
            }}
          />
        </div>
      )}

      <div className="mt-[1.3rem] flex items-center justify-end gap-3">
        <span className="mr-2 text-lg text-subtle">Showing {shown.length} results</span>
        <Button
          variant="ghost"
          disabled={shown.length === 0}
          className="h-[2.9rem] gap-2 border-line! px-5 text-lg! font-medium! disabled:cursor-not-allowed disabled:text-muted"
          onClick={() => {
            if (tab === "ready") {
              setConfirmOpen(true);
            } else {
              const ids = shown.map((r) => r.id);
              exportRows(ids);
              setPinned(ids);
              setToast(`Re-downloaded ${shown.length} payouts. Last Exported DateTime updated.`);
            }
          }}
        >
          <Download size="1.2rem" strokeWidth={2} /> Export CSV
        </Button>
      </div>

      <div className="mt-[1.3rem]">
        <ExportTable
          rows={shown}
          emptyText={
            tab === "ready"
              ? "No Manual Bank Transfer payouts are ready to export."
              : "No exported payouts match these dates."
          }
        />
      </div>

      <ExportConfirmDialog
        open={confirmOpen}
        count={ready.length}
        total={readyTotal}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          const count = ready.length;
          exportRows(ready.map((r) => r.id));
          setConfirmOpen(false);
          setToast(`Exported ${count} payouts. They are now Payment Completed and listed under Previously Exported.`);
        }}
      />
      <Toast message={toast} onClose={closeToast} />
    </div>
  );
}
