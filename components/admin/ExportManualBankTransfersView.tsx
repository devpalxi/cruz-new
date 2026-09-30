"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import WarningAlert from "@/components/ui/WarningAlert";
import { MOCK_UNEXPORTED_MANUAL_BANK_TRANSFERS, type ManualBankTransfer } from "@/lib/admin-data";
import AvReferenceModal from "./AvReferenceModal";
import ExportManualBankTransfersModal from "./ExportManualBankTransfersModal";

function downloadCsv(rows: ManualBankTransfer[]) {
  const header = [
    "Payout ID",
    "Venue Code",
    "Bank Transfer Amount",
    "BSB",
    "Account Number",
    "Account Name",
    "Collection DateTime",
  ];
  const lines = rows.map((row) =>
    [row.payoutId, row.venueCode, row.amount, row.bsb, row.accountNumber, row.accountName, row.collectedAt]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `manual-bank-transfers-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const columns: DataTableColumn<ManualBankTransfer>[] = [
  { key: "payoutId", label: "Payout ID", render: (row) => row.payoutId },
  { key: "venueCode", label: "Venue Code", render: (row) => row.venueCode },
  {
    key: "amount",
    label: "Bank Transfer Amount",
    align: "right",
    headerMaxWidth: "8rem",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
  { key: "bsb", label: "BSB", render: (row) => row.bsb },
  { key: "accountNumber", label: "Account Number", render: (row) => row.accountNumber },
  { key: "accountName", label: "Account Name", render: (row) => row.accountName },
  { key: "collectedAt", label: "Collection DateTime", render: (row) => row.collectedAt },
];

export default function ExportManualBankTransfersView() {
  const [transfers, setTransfers] = useState<ManualBankTransfer[]>(MOCK_UNEXPORTED_MANUAL_BANK_TRANSFERS);
  const [modal, setModal] = useState<"export" | "reference" | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  function handleExport(_venue: string, matched: ManualBankTransfer[]) {
    downloadCsv(matched);
    // Once exported, these drop off the "unexported" list — they only reach payment completed
    // once the AV reference is confirmed below.
    setTransfers((prev) => prev.filter((t) => !matched.some((m) => m.payoutId === t.payoutId)));
    setPendingCount(matched.length);
    setCompletedMessage(null);
    setModal("reference");
  }

  function handleConfirmReference(reference: string) {
    setModal(null);
    setCompletedMessage(
      `${pendingCount} transfer${pendingCount === 1 ? "" : "s"} marked as payment completed. AV Reference: ${reference}`,
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[2.25rem] font-bold leading-[2.875rem] text-brand">Export Manual Bank Transfers</h1>
        <Button
          onClick={() => setModal("export")}
          disabled={transfers.length === 0}
          className="h-[2.875rem] gap-2 px-6"
        >
          <Download size="1.125rem" strokeWidth={2} />
          Export
        </Button>
      </div>

      {completedMessage && (
        <div className="mb-6">
          <WarningAlert tone="success" message={completedMessage} />
        </div>
      )}

      <DataTable
        columns={columns}
        rows={transfers}
        rowKey={(row) => row.payoutId}
        emptyMessage="No unexported manual bank transfers."
      />
      <Pagination />

      {modal === "export" && (
        <ExportManualBankTransfersModal transfers={transfers} onClose={() => setModal(null)} onExport={handleExport} />
      )}
      {modal === "reference" && (
        <AvReferenceModal
          transferCount={pendingCount}
          onClose={() => setModal(null)}
          onConfirm={handleConfirmReference}
        />
      )}
    </div>
  );
}
