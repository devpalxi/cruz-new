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

// Cheque fields for the Collector. Required when only the Collector enters them, optional when both can.
// When only the Authoriser enters them the Collector skips this step, so there is nothing to show.
export default function ChequeDetailsFields({
  mode,
  chequeNumber,
  onChequeNumberChange,
  chequeName,
  onChequeNameChange,
  errors = {},
}: ChequeDetailsFieldsProps) {
  if (mode === "authoriser") return null;

  const optional = mode === "both";
  return (
    <div className="flex flex-col gap-[1.375rem]">
      <FormField
        label={optional ? "Cheque Number (optional)" : "Cheque Number"}
        htmlFor="cheque-number"
        required={!optional}
      >
        <TextInput id="cheque-number" value={chequeNumber} onChange={(e) => onChequeNumberChange(e.target.value)} />
        {errors.chequeNumber && <p className="text-base text-danger">{errors.chequeNumber}</p>}
      </FormField>
      <FormField
        label={optional ? "Cheque Name (optional)" : "Cheque Name"}
        htmlFor="cheque-name"
        required={!optional}
      >
        <TextInput id="cheque-name" value={chequeName} onChange={(e) => onChequeNameChange(e.target.value)} />
        {errors.chequeName && <p className="text-base text-danger">{errors.chequeName}</p>}
      </FormField>
    </div>
  );
}
