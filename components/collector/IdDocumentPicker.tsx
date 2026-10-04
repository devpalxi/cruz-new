import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectInput from "@/components/ui/SelectInput";
import {
  ID_COUNTRIES,
  ID_DOCUMENT_LABELS,
  getIdDocumentTypes,
  type IdDocumentType,
} from "@/lib/id-document-config";

type IdDocumentPickerProps = {
  country: string;
  onCountryChange: (country: string) => void;
  onSelectDocument: (document: IdDocumentType) => void;
};

// Country first, then only the document types FrankieOne supports for that country.
export default function IdDocumentPicker({ country, onCountryChange, onSelectDocument }: IdDocumentPickerProps) {
  return (
    <div>
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        Primary ID Document
      </h1>
      <FormField label="Issuing Country" htmlFor="issuing-country">
        <SelectInput
          id="issuing-country"
          options={ID_COUNTRIES}
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
        />
      </FormField>

      {country !== "" && (
        <div className="mt-[1.375rem] flex flex-col gap-4">
          {getIdDocumentTypes(country).map((document) => (
            <Button key={document} onClick={() => onSelectDocument(document)} className="h-[2.875rem] w-full">
              {ID_DOCUMENT_LABELS[document]}
            </Button>
          ))}
        </div>
      )}

      <Button variant="outline" href="/collector/email-address" className="mt-[3.8125rem] h-[2.875rem] w-full">
        Back
      </Button>
    </div>
  );
}
