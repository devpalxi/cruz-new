import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";

type BankAccountFieldsProps = {
  accountName: string;
  onAccountNameChange: (value: string) => void;
  bsb: string;
  onBsbChange: (value: string) => void;
  accountNumber: string;
  onAccountNumberChange: (value: string) => void;
  venueCode?: string;
  onVenueCodeChange?: (value: string) => void;
  // Payment file only.
  showVenueCode?: boolean;
  // Inline messages, shown under the field they belong to
  errors?: { accountName?: string; bsb?: string; accountNumber?: string };
};

// Account Name/BSB/Account Number fields shared by Bank Transfer and Manual Bank Transfer, plus
// Manual Bank Transfer's Venue Code field. Used by the real Payment Method Details step and
// reused as-is for reference.
export default function BankAccountFields({
  accountName,
  onAccountNameChange,
  bsb,
  onBsbChange,
  accountNumber,
  onAccountNumberChange,
  venueCode = "",
  onVenueCodeChange,
  showVenueCode = false,
  errors = {},
}: BankAccountFieldsProps) {
  return (
    <div className="flex flex-col gap-[1.375rem]">
      <FormField label="Account Name" htmlFor="bank-account-name">
        <TextInput
          id="bank-account-name"
          value={accountName}
          onChange={(e) => onAccountNameChange(e.target.value)}
        />
        {errors.accountName && <p className="text-base text-danger">{errors.accountName}</p>}
      </FormField>
      <FormField label="BSB" htmlFor="bank-bsb">
        <TextInput id="bank-bsb" value={bsb} onChange={(e) => onBsbChange(e.target.value)} />
        {errors.bsb && <p className="text-base text-danger">{errors.bsb}</p>}
      </FormField>
      <FormField label="Account Number" htmlFor="bank-account-number">
        <TextInput
          id="bank-account-number"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
        />
        {errors.accountNumber && <p className="text-base text-danger">{errors.accountNumber}</p>}
      </FormField>
      {showVenueCode && (
        <FormField label="Venue Code" htmlFor="manual-bank-venue-code">
          <TextInput
            id="manual-bank-venue-code"
            value={venueCode}
            onChange={(e) => onVenueCodeChange?.(e.target.value)}
          />
        </FormField>
      )}
    </div>
  );
}
