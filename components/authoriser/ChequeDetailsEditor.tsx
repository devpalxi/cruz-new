"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import DetailList from "@/components/ui/DetailList";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";

export type ChequeEditorState = { number: string; name: string; complete: boolean };

type ChequeDetailsEditorProps = {
  // What the Collector already recorded; blank when nothing was entered
  initialNumber?: string;
  initialName?: string;
  // Tells the page the current values and whether both are entered and checked, so the card and Authorise can follow
  onChange?: (state: ChequeEditorState) => void;
};

// The Authoriser enters or completes the cheque details (Authoriser Only, or Collector and Authoriser Both).
// It sits inside the Payment Method Details card in place of the Cheque Number and Cheque Name rows.
// Both fields are needed before authorising. Once checked, the rows show the saved details with an edit icon.
export default function ChequeDetailsEditor({
  initialNumber = "",
  initialName = "",
  onChange,
}: ChequeDetailsEditorProps) {
  const [chequeNumber, setChequeNumber] = useState(initialNumber);
  const [chequeName, setChequeName] = useState(initialName);
  const [validated, setValidated] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    onChange?.({ number: chequeNumber, name: chequeName, complete: validated });
  }, [chequeNumber, chequeName, validated, onChange]);

  const numberError = chequeNumber.trim() === "" ? "Enter the cheque number." : undefined;
  const nameError = chequeName.trim() === "" ? "Enter the name on the cheque." : undefined;

  function updateChequeNumber(value: string) {
    setChequeNumber(value);
    setValidated(false);
  }
  function updateChequeName(value: string) {
    setChequeName(value);
    setValidated(false);
  }

  function handleValidate() {
    if (numberError || nameError) {
      setShowErrors(true);
      return;
    }
    setValidated(true);
  }

  // Compact sizing matches the rest of this page's inline form controls
  const fieldClassName = "h-[2.9375rem]! rounded-md! bg-surface! px-3! text-sm!";

  if (validated) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <DetailList
              rows={[
                { label: "Cheque Number", value: chequeNumber },
                { label: "Cheque Name", value: chequeName },
              ]}
              labelClassName="font-medium"
            />
          </div>
          <button
            type="button"
            onClick={() => setValidated(false)}
            aria-label="Edit cheque details"
            className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-subtle hover:bg-surface hover:text-ink"
          >
            <Pencil size="1.125rem" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Cheque Number" htmlFor="authoriser-cheque-number" required>
        <TextInput
          id="authoriser-cheque-number"
          value={chequeNumber}
          onChange={(e) => updateChequeNumber(e.target.value)}
          className={fieldClassName}
        />
        {showErrors && numberError && <p className="text-base text-danger">{numberError}</p>}
      </FormField>
      <FormField label="Cheque Name" htmlFor="authoriser-cheque-name" required>
        <TextInput
          id="authoriser-cheque-name"
          value={chequeName}
          onChange={(e) => updateChequeName(e.target.value)}
          className={fieldClassName}
        />
        {showErrors && nameError && <p className="text-base text-danger">{nameError}</p>}
      </FormField>

      <Button type="button" onClick={handleValidate} className="h-[2.875rem] w-full">
        Check Name Match
      </Button>
    </div>
  );
}
