import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import StepFormLayout from "./StepFormLayout";

type IdDobFormProps = {
  dateOfBirth: string;
  onChange: (dateOfBirth: string) => void;
  onBack: () => void;
  onNext: () => void;
};

// "You must be over 18" (see Before you start) — the date is capped at 18 years ago.
function maxDateOfBirth(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().slice(0, 10);
}

export default function IdDobForm({ dateOfBirth, onChange, onBack, onNext }: IdDobFormProps) {
  return (
    <StepFormLayout title="Your date of birth" onBack={onBack} onNext={onNext} nextDisabled={dateOfBirth === ""}>
      <FormField label="Date of Birth" htmlFor="date-of-birth">
        <TextInput
          id="date-of-birth"
          type="date"
          max={maxDateOfBirth()}
          value={dateOfBirth}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    </StepFormLayout>
  );
}
