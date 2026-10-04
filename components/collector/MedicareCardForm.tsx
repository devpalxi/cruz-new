import FormField from "@/components/ui/FormField";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import StepFormLayout from "./StepFormLayout";

export type MedicareDetails = { cardNumber: string; irn: string; colour: string; expiry: string };

export const EMPTY_MEDICARE: MedicareDetails = { cardNumber: "", irn: "", colour: "", expiry: "" };

const CARD_COLOURS = [
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
];

type MedicareCardFormProps = {
  details: MedicareDetails;
  onChange: (details: MedicareDetails) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function MedicareCardForm({ details, onChange, onBack, onNext }: MedicareCardFormProps) {
  const complete =
    /^\d{10}$/.test(details.cardNumber) && /^[1-9]$/.test(details.irn) && details.colour !== "" && details.expiry !== "";

  return (
    <StepFormLayout title="Medicare Card Details" onBack={onBack} onNext={onNext} nextDisabled={!complete}>
      <FormField label="Medicare Card Number" htmlFor="medicare-number">
        <TextInput
          id="medicare-number"
          inputMode="numeric"
          maxLength={10}
          placeholder="10 digit card number"
          value={details.cardNumber}
          onChange={(e) => onChange({ ...details, cardNumber: e.target.value.replace(/\D/g, "") })}
        />
        <p className="text-base text-subtle">Enter the 10-digit number on your Medicare card</p>
      </FormField>
      <FormField label="Individual Reference Number (IRN)" htmlFor="medicare-irn">
        <TextInput
          id="medicare-irn"
          inputMode="numeric"
          maxLength={1}
          placeholder="Position on card (1-9)"
          value={details.irn}
          onChange={(e) => onChange({ ...details, irn: e.target.value.replace(/\D/g, "") })}
        />
        <p className="text-base text-subtle">Your position on the card (1-9)</p>
      </FormField>
      <FormField label="Card Color" htmlFor="medicare-colour">
        <SelectInput
          id="medicare-colour"
          options={CARD_COLOURS}
          value={details.colour}
          onChange={(e) => onChange({ ...details, colour: e.target.value })}
        />
      </FormField>
      <FormField label="Card Expiry Date" htmlFor="medicare-expiry">
        <TextInput
          id="medicare-expiry"
          type="date"
          value={details.expiry}
          onChange={(e) => onChange({ ...details, expiry: e.target.value })}
        />
      </FormField>
      <p className="text-base text-subtle">
        Note: Medicare card is a secondary form of ID. It helps verify your identity but is not a primary photo ID.
      </p>
    </StepFormLayout>
  );
}
