"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";
import SelectInput from "@/components/ui/SelectInput";
import { EXPORT_VENUES, type ManualBankTransfer } from "@/lib/admin-data";

type ExportManualBankTransfersModalProps = {
  transfers: ManualBankTransfer[];
  onClose: () => void;
  onExport: (venue: string, matched: ManualBankTransfer[]) => void;
};

export default function ExportManualBankTransfersModal({
  transfers,
  onClose,
  onExport,
}: ExportManualBankTransfersModalProps) {
  const [venue, setVenue] = useState("");
  const matched = venue === "" ? transfers : transfers.filter((t) => t.venue === venue);

  return (
    <Modal
      title="Export Manual Bank Transfers"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="h-[2.875rem] px-8">
            Cancel
          </Button>
          <Button
            disabled={matched.length === 0}
            onClick={() => onExport(venue, matched)}
            className="h-[2.875rem] gap-2 px-8"
          >
            <Download size="1.125rem" strokeWidth={2} />
            Export {matched.length} Transfer{matched.length === 1 ? "" : "s"}
          </Button>
        </>
      }
    >
      <p className="text-base text-label">
        Select a venue to export manual bank transfers, or leave as &quot;All Venues&quot; to export all transfers
        you have access to.
      </p>
      <div className="mt-6">
        <FormField label="Venue" htmlFor="export-venue">
          <SelectInput
            id="export-venue"
            options={EXPORT_VENUES}
            placeholder="All Venues"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </FormField>
      </div>
      <p className="mt-4 text-base text-ink">
        <span className="font-semibold">{matched.length}</span> transfer{matched.length === 1 ? "" : "s"} will be
        exported
      </p>
    </Modal>
  );
}
