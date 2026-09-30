"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import DetailList from "@/components/ui/DetailList";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import WarningAlert from "@/components/ui/WarningAlert";

// Authoriser responsible for cheque details (Authoriser-only, or Collector-and-Authoriser after a
// skip): the "Payout Destination Details" section becomes inline editable instead of read-only,
// with its own Validate action — same happy-path pattern as the collector's, run on this page.
// Once validated, the section collapses to a read-only summary with an edit icon to reopen the
// form and rerun validation.
export default function ChequeInlineEditScenario() {
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeName, setChequeName] = useState("");
  const [validated, setValidated] = useState(false);

  const fieldsComplete = chequeNumber !== "" && chequeName !== "";

  function updateChequeNumber(value: string) {
    setChequeNumber(value);
    setValidated(false);
  }
  function updateChequeName(value: string) {
    setChequeName(value);
    setValidated(false);
  }

  // This is what would replace the current <DetailList rows={data.bank} .../> inside the existing
  // "Payout Destination Details" accordion item on AuthoriserPayoutView — no extra card or title,
  // since the accordion item already provides both.
  // Compact sizing matches the rest of this page's inline form controls (e.g. the Risk Level
  // select and Authoriser Note textarea in AuthorisationPanel), not the collector's larger fields.
  const fieldClassName = "h-[2.9375rem]! rounded-md! bg-surface! px-3! text-sm!";

  if (validated) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <DetailList
            rows={[
              { label: "Cheque Number", value: chequeNumber },
              { label: "Cheque Name", value: chequeName },
            ]}
            labelClassName="font-medium"
          />
          <button
            type="button"
            onClick={() => setValidated(false)}
            aria-label="Edit cheque details"
            className="mt-1 flex shrink-0 items-center justify-center rounded-md p-1.5 text-subtle hover:bg-surface hover:text-ink"
          >
            <Pencil size="1.125rem" />
          </button>
        </div>
        <WarningAlert tone="success" title="Cheque bearer name matches." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Cheque Number" htmlFor="authoriser-cheque-number">
        <TextInput
          id="authoriser-cheque-number"
          value={chequeNumber}
          onChange={(e) => updateChequeNumber(e.target.value)}
          className={fieldClassName}
        />
      </FormField>
      <FormField label="Cheque Name" htmlFor="authoriser-cheque-name">
        <TextInput
          id="authoriser-cheque-name"
          value={chequeName}
          onChange={(e) => updateChequeName(e.target.value)}
          className={fieldClassName}
        />
      </FormField>

      <Button
        type="button"
        disabled={!fieldsComplete}
        onClick={() => setValidated(true)}
        className="h-[2.875rem] w-full"
      >
        Validate Cheque
      </Button>
    </div>
  );
}
