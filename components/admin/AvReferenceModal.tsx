"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/TextInput";

type AvReferenceModalProps = {
  transferCount: number;
  onClose: () => void;
  onConfirm: (reference: string) => void;
};

// Shown immediately after an export completes — the transfers only move to payment completed
// once this reference number is provided.
export default function AvReferenceModal({ transferCount, onClose, onConfirm }: AvReferenceModalProps) {
  const [reference, setReference] = useState("");

  return (
    <Modal
      title="Account Validation Reference"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="h-[2.875rem] px-8">
            Cancel
          </Button>
          <Button
            disabled={reference.trim() === ""}
            onClick={() => onConfirm(reference.trim())}
            className="h-[2.875rem] px-8"
          >
            Confirm
          </Button>
        </>
      }
    >
      <p className="text-base text-label">
        Export complete for {transferCount} transfer{transferCount === 1 ? "" : "s"}. Enter the Account Validation
        (AV) reference number from the bank file to mark{" "}
        {transferCount === 1 ? "this transfer" : "these transfers"} as payment completed.
      </p>
      <div className="mt-6">
        <FormField label="AV Reference Number" htmlFor="av-reference">
          <TextInput
            id="av-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. AV-2026-04821"
          />
        </FormField>
      </div>
    </Modal>
  );
}
