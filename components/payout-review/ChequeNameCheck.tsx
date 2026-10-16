import CheckboxRow from "@/components/ui/CheckboxRow";
import DetailList from "@/components/ui/DetailList";
import FormField from "@/components/ui/FormField";
import InsetCard from "@/components/ui/InsetCard";
import TextArea from "@/components/ui/TextArea";
import VerificationPill, { type VerificationTone } from "@/components/ui/VerificationPill";
import WarningAlert from "@/components/ui/WarningAlert";
import {
  NAME_NOT_VERIFIED_NOTE,
  NAME_RESULT_TEXT,
  NAME_SOURCE_LABELS,
  type NameCheckRecord,
  type NameMatchResult,
  type NameMatchStatus,
} from "@/lib/name-match";
import { RETURN_REASON_MAX_LENGTH } from "@/lib/return-payout";
import NameBox from "./NameBox";

type ChequeNameCheckProps = {
  result: NameMatchResult;
  chequeName: string;
  comparedName: string;
  // The Authoriser's saved decision, shown read-only
  saved?: NameCheckRecord;
  // Only the Authoriser can resolve a name difference. Everyone else sees the result read-only.
  resolution?: {
    rationale: string;
    onRationaleChange: (value: string) => void;
    acknowledged: boolean;
    onAcknowledgedChange: (value: boolean) => void;
  };
};

const RESULT_TONE: Record<NameMatchStatus, VerificationTone> = {
  match: "success",
  "no-match": "danger",
  unable: "warning",
};

// Cheque name beside the verified ID name (or the captured recipient name when no ID document was submitted),
// with the result. For a difference the Authoriser records a rationale and acknowledges it; the saved decision
// then shows read-only. The same block is used on every role's page.
export default function ChequeNameCheck({ result, chequeName, comparedName, saved, resolution }: ChequeNameCheckProps) {
  const capturedName = result.source !== "id";
  const differenceKind = capturedName ? "captured recipient name" : "verified ID name";

  return (
    <InsetCard title="Cheque Name Check">
      <div className="flex items-center gap-4">
        <NameBox label={NAME_SOURCE_LABELS[result.source]} value={comparedName.trim() || "Not available"} />
        <NameBox label="Cheque Name" value={chequeName.trim() || "Not entered yet"} />
      </div>

      <p className="mt-4 flex items-center justify-between text-base text-ink">
        <span className="font-medium">Result:</span>
        <VerificationPill tone={RESULT_TONE[result.status]}>{NAME_RESULT_TEXT[result.status]}</VerificationPill>
      </p>

      {capturedName && (
        <div className="mt-4">
          <WarningAlert message={NAME_NOT_VERIFIED_NOTE} />
        </div>
      )}
      {result.status === "unable" && result.reason && (
        <div className="mt-4">
          <WarningAlert message={result.reason} />
        </div>
      )}

      {result.status === "no-match" && saved && (
        <div className="mt-4 border-t border-line-soft pt-4">
          <DetailList
            labelClassName="font-medium"
            rows={[
              { label: "Rationale", value: saved.rationale },
              { label: "Acknowledged", value: saved.acknowledged ? "Yes" : "No" },
              { label: "Resolved By", value: `${saved.authoriser} (Authoriser)` },
              { label: "Resolved On", value: saved.recordedAt },
            ]}
          />
        </div>
      )}

      {result.status === "no-match" && !saved && !resolution && (
        <div className="mt-4">
          <WarningAlert tone="danger" message="Names differ. The Authoriser records a reason before the payout is completed." />
        </div>
      )}

      {result.status === "no-match" && !saved && resolution && (
        <div className="mt-4 flex flex-col gap-4">
          <FormField label="Rationale" htmlFor="name-rationale" required>
            <TextArea
              id="name-rationale"
              rows={3}
              maxLength={RETURN_REASON_MAX_LENGTH}
              value={resolution.rationale}
              onChange={(e) => resolution.onRationaleChange(e.target.value)}
              className="max-h-[10rem] resize-none overflow-y-auto"
            />
            <span className="text-right text-base text-subtle">
              {resolution.rationale.length}/{RETURN_REASON_MAX_LENGTH}
            </span>
          </FormField>
          <CheckboxRow id="name-acknowledged" checked={resolution.acknowledged} onChange={resolution.onAcknowledgedChange}>
            I acknowledge that the cheque name differs from the {differenceKind} and confirm completion of this payout.
          </CheckboxRow>
        </div>
      )}
    </InsetCard>
  );
}
