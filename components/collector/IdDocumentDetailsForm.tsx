import FormField from "@/components/ui/FormField";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { getIdDocumentFields, getIdDocumentHeading, type IdDocumentType } from "@/lib/id-document-config";
import StepFormLayout from "./StepFormLayout";

type IdDocumentDetailsFormProps = {
  country: string;
  document: IdDocumentType;
  details: Record<string, string>;
  onDetailsChange: (details: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
};

// Fields come from the config, so e.g. an Australian licence asks for a State and a New Zealand
// licence doesn't.
export default function IdDocumentDetailsForm({
  country,
  document,
  details,
  onDetailsChange,
  onBack,
  onNext,
}: IdDocumentDetailsFormProps) {
  const fields = getIdDocumentFields(country, document);
  const complete = fields.every((field) => (details[field.key] ?? "").trim() !== "");

  return (
    <StepFormLayout
      title={getIdDocumentHeading(document)}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!complete}
    >
      {fields.map((field) => {
        const id = `id-field-${field.key}`;
        const value = details[field.key] ?? "";
        const update = (next: string) => onDetailsChange({ ...details, [field.key]: next });
        return (
          <FormField key={field.key} label={field.label} htmlFor={id}>
            {field.input === "select" ? (
              <SelectInput
                id={id}
                placeholder="Select State"
                options={field.options ?? []}
                value={value}
                onChange={(e) => update(e.target.value)}
              />
            ) : (
              <TextInput
                id={id}
                type={field.input === "date" ? "date" : "text"}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => update(e.target.value)}
              />
            )}
          </FormField>
        );
      })}
    </StepFormLayout>
  );
}
