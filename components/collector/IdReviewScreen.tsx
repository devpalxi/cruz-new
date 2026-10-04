import {
  ID_DOCUMENT_LABELS,
  formatIdAddress,
  getIdDocumentFields,
  getCountryLabel,
  type IdAddress,
  type IdCheckResult,
  type IdDocumentType,
  type PrimaryIdScreen,
} from "@/lib/id-document-config";
import IdentityCheckPanel from "./IdentityCheckPanel";
import ReviewSection from "./ReviewSection";

type IdReviewScreenProps = {
  country: string;
  document: IdDocumentType;
  details: Record<string, string>;
  fullName: string;
  dateOfBirth: string;
  address: IdAddress;
  onEdit: (screen: PrimaryIdScreen) => void;
  onBack: () => void;
  onComplete: (result: IdCheckResult) => void;
};

export default function IdReviewScreen({
  country,
  document,
  details,
  fullName,
  dateOfBirth,
  address,
  onEdit,
  onBack,
  onComplete,
}: IdReviewScreenProps) {
  const fields = getIdDocumentFields(country, document);

  return (
    <div>
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        Please check your details
      </h1>

      <div className="flex flex-col gap-4 rounded-[1.25rem] border border-line-soft bg-surface px-[1.625rem] py-[2rem]">
        <p className="text-[1.375rem] font-semibold text-ink">Your Details</p>
        <ReviewSection label="Name" onEdit={() => onEdit("name")}>
          {fullName}
        </ReviewSection>
        <ReviewSection label="Date of Birth" onEdit={() => onEdit("dob")}>
          {dateOfBirth}
        </ReviewSection>
        <ReviewSection label="Address" onEdit={() => onEdit("address")}>
          {formatIdAddress(address)}
        </ReviewSection>

        <p className="mt-2 text-[1.375rem] font-semibold text-ink">
          {ID_DOCUMENT_LABELS[document]} Details
        </p>
        <ReviewSection label="Country of Issue" onEdit={() => onEdit("document")}>
          {getCountryLabel(country)}
        </ReviewSection>
        <ReviewSection label="Document" onEdit={() => onEdit("details")}>
          {fields.map((field) => (
            <p key={field.key} className="text-xl">
              <span className="text-subtle">{field.label}: </span>
              {details[field.key]}
            </p>
          ))}
        </ReviewSection>
      </div>

      <div className="mt-[2.125rem]">
        <IdentityCheckPanel manual={document === "manual-kyc"} onBack={onBack} onComplete={onComplete} />
      </div>
    </div>
  );
}
