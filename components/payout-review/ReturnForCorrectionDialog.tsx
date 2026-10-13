"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/ui/TextArea";
import { RETURN_REASON_MAX_LENGTH } from "@/lib/return-payout";

type ReturnForCorrectionDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export default function ReturnForCorrectionDialog({ open, onCancel, onConfirm }: ReturnForCorrectionDialogProps) {
  const [reason, setReason] = useState("");
  const [showError, setShowError] = useState(false);

  function handleConfirm() {
    if (reason.trim() === "") {
      setShowError(true);
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setShowError(false);
  }

  function handleCancel() {
    setReason("");
    setShowError(false);
    onCancel();
  }

  return (
    <Modal
      open={open}
      title="Return Payout to Collector"
      onClose={handleCancel}
      actions={
        <>
          <Button variant="outline" className="h-[2.875rem] px-6" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="h-[2.875rem] px-6" onClick={handleConfirm}>
            Return Payout
          </Button>
        </>
      }
    >
      <p>Enter the reason for returning this payout. The Collector will see it.</p>
      <div className="mt-4">
        <FormField label="Reason" htmlFor="return-reason" required>
          <TextArea
            id="return-reason"
            rows={4}
            maxLength={RETURN_REASON_MAX_LENGTH}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setShowError(false);
            }}
            placeholder="The BSB does not match the account name."
            className="max-h-[10rem] resize-none overflow-y-auto"
          />
        </FormField>
        <div className="mt-1 flex justify-between gap-4 text-base">
          <span className="text-danger">{showError ? "Enter a reason before returning the payout." : ""}</span>
          <span className="text-subtle">
            {reason.length}/{RETURN_REASON_MAX_LENGTH}
          </span>
        </div>
      </div>
    </Modal>
  );
}
