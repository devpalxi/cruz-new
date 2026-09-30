"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type AvReferenceDialogProps = {
  open: boolean;
  count: number;
  total: number;
  exportedAt: string;
  // true right after an export (download already happened)
  justExported: boolean;
  onLater: () => void;
  onSave: (reference: string) => void;
};

export default function AvReferenceDialog({
  open,
  count,
  total,
  exportedAt,
  justExported,
  onLater,
  onSave,
}: AvReferenceDialogProps) {
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
      title="Enter AV Reference Number"
      onClose={() => close(onLater)}
      actions={
        <>
          <Button variant="outline" className="h-[2.875rem] px-6" onClick={() => close(onLater)}>
            Later
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
      {justExported && <p className="mb-2 font-medium text-success">CSV downloaded.</p>}
      <p>
        Enter the Account Validation reference for this export of <strong className="text-ink">{count} payouts</strong>{" "}
        (<strong className="text-ink">${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</strong>, exported{" "}
        {exportedAt}). Saving moves them to <strong className="text-ink">Payment Completed</strong>.
      </p>
      <label htmlFor="av-reference" className="mt-5 block text-base font-semibold text-label">
        AV Reference Number
      </label>
      <input
        id="av-reference"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={error}
        placeholder="e.g. AV-20260930-0421"
        className={`mt-2 h-[3.25rem] w-full rounded-md border bg-field px-4 text-lg text-ink outline-none focus:ring-2 ${
          error ? "border-fail focus:ring-fail" : "border-line focus:border-focus focus:ring-focus"
        }`}
      />
      {error && <p className="mt-1.5 text-base text-fail">AV reference number is required.</p>}
      <p className="mt-3 text-base text-subtle">
        Not ready yet? Choose Later — the export will wait under Awaiting AV Reference.
      </p>
    </Modal>
  );
}
