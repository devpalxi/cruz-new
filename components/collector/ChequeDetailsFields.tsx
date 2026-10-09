import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import type { ChequeMode } from "@/lib/venue-data";

type ChequeDetailsFieldsProps = {
  mode: ChequeMode;
  chequeNumber: string;
  onChequeNumberChange: (value: string) => void;
  chequeName: string;
  onChequeNameChange: (value: string) => void;
  errors?: { chequeNumber?: string; chequeName?: string };
};

// Cheque fields for the Collector. What the Collector sees depends on who the venue says enters the details.
export default function ChequeDetailsFields({
  mode,
  chequeNumber,
  onChequeNumberChange,
  chequeName,
  onChequeNameChange,
  errors = {},
}: ChequeDetailsFieldsProps) {
  if (mode === "authoriser") {
    return (
      <p className="text-lg text-ink">
        The Authoriser will enter the cheque details before authorising this payout. There is nothing to enter here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[1.375rem]">
      {mode === "both" && (
        <p className="text-base text-subtle">
          You can enter these details now or leave them blank. The Authoriser completes anything missing before
          authorising.
        </p>
      )}
      <FormField label={mode === "both" ? "Cheque Number (optional)" : "Cheque Number"} htmlFor="cheque-number">
        <TextInput id="cheque-number" value={chequeNumber} onChange={(e) => onChequeNumberChange(e.target.value)} />
        {errors.chequeNumber && <p className="text-base text-danger">{errors.chequeNumber}</p>}
      </FormField>
      <FormField label={mode === "both" ? "Cheque Name (optional)" : "Cheque Name"} htmlFor="cheque-name">
        <TextInput id="cheque-name" value={chequeName} onChange={(e) => onChequeNameChange(e.target.value)} />
        {errors.chequeName && <p className="text-base text-danger">{errors.chequeName}</p>}
      </FormField>
    </div>
  );
}
