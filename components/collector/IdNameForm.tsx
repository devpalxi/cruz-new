import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import StepFormLayout from "./StepFormLayout";

type IdNameFormProps = {
  firstName: string;
  middleName: string;
  lastName: string;
  onChange: (patch: { firstName?: string; middleName?: string; lastName?: string }) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function IdNameForm({ firstName, middleName, lastName, onChange, onBack, onNext }: IdNameFormProps) {
  return (
    <StepFormLayout
      title="Name"
      onBack={onBack}
      onNext={onNext}
      nextDisabled={firstName.trim() === "" || lastName.trim() === ""}
    >
      <FormField label="First Name" htmlFor="first-name">
        <TextInput
          id="first-name"
          placeholder="Enter your first name exactly as it appears on your ID"
          value={firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
        />
      </FormField>
      <FormField label="Middle Name" htmlFor="middle-name">
        <TextInput
          id="middle-name"
          placeholder="Enter your middle name exactly as it appears on your ID"
          value={middleName}
          onChange={(e) => onChange({ middleName: e.target.value })}
        />
      </FormField>
      <FormField label="Last Name" htmlFor="last-name">
        <TextInput
          id="last-name"
          placeholder="Enter your last name exactly as it appears on your ID"
          value={lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
        />
      </FormField>
    </StepFormLayout>
  );
}
