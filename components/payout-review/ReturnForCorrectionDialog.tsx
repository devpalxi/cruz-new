"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/ui/TextArea";

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
      <p>
        Tell the Collector what needs correcting. They will see your message, fix the details and send the payout back.
      </p>
      <label htmlFor="return-reason" className="mt-4 block text-base font-semibold text-label">
        Reason
      </label>
      <TextArea
        id="return-reason"
        rows={3}
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setShowError(false);
        }}
        placeholder="For example: the BSB does not match the account name."
        className="mt-2"
      />
      {showError && <p className="mt-1 text-base text-danger">Enter a reason before returning the payout.</p>}
    </Modal>
  );
}
