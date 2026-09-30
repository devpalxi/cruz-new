"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type AbaReferenceDialogProps = {
  open: boolean;
  count: number;
  total: number;
  exportedAt: string;
  onCancel: () => void;
  onSave: (reference: string) => void;
};

export default function AbaReferenceDialog({
  open,
  count,
  total,
  exportedAt,
  onCancel,
  onSave,
}: AbaReferenceDialogProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const trimmed = value.trim();
  const error = touched && trimmed === "";

  function close(fn: () => void) {
    setValue("");
    setTouched(false);
    fn();
  }

  return (
    <Modal
      open={open}
      title="Enter ABA Reference Number"
      onClose={() => close(onCancel)}
      actions={
        <>
          <Button variant="outline" className="h-[2.875rem] px-6" onClick={() => close(onCancel)}>
            Cancel
          </Button>
          <Button
            className="h-[2.875rem] px-6"
            onClick={() => {
              setTouched(true);
              if (trimmed) close(() => onSave(trimmed));
            }}
          >
            Save &amp; Complete
          </Button>
        </>
      }
    >
      <p>
        Enter the ABA reference issued by the bank for this export of <strong className="text-ink">{count} payouts</strong>{" "}
        (<strong className="text-ink">${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</strong>, exported{" "}
        {exportedAt}). Saving moves them to <strong className="text-ink">Payment Completed</strong>.
      </p>
      <label htmlFor="aba-reference" className="mt-5 block text-base font-semibold text-label">
        ABA Reference Number
      </label>
      <input
        id="aba-reference"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={error}
        placeholder="e.g. ABA-20260930-0421"
        className={`mt-2 h-[3.25rem] w-full rounded-md border bg-field px-4 text-lg text-ink outline-none focus:ring-2 ${
          error ? "border-fail focus:ring-fail" : "border-line focus:border-focus focus:ring-focus"
        }`}
      />
      {error && <p className="mt-1.5 text-base text-fail">ABA reference number is required.</p>}
      <p className="mt-3 text-base text-subtle">
        The bank issues this reference after it processes the ABA file.
      </p>
    </Modal>
  );
}
