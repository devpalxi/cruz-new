import FormField from "@/components/ui/FormField";
import CheckboxRow from "@/components/ui/CheckboxRow";
import InsetCard from "@/components/ui/InsetCard";
import TextArea from "@/components/ui/TextArea";
import VerificationPill, { type VerificationTone } from "@/components/ui/VerificationPill";
import WarningAlert from "@/components/ui/WarningAlert";
import {
  NAME_NOT_VERIFIED_NOTE,
  NAME_SOURCE_LABELS,
  type NameMatchResult,
  type NameMatchStatus,
} from "@/lib/name-match";
import { RETURN_REASON_MAX_LENGTH } from "@/lib/return-payout";
import NameBox from "./NameBox";

type ChequeNameCheckProps = {
  result: NameMatchResult;
  chequeName: string;
  comparedName: string;
  // Only the Authoriser can resolve a name difference. Everyone else sees the result read-only.
  resolution?: {
    rationale: string;
    onRationaleChange: (value: string) => void;
    acknowledged: boolean;
    onAcknowledgedChange: (value: boolean) => void;
  };
};

const RESULT_PILL: Record<NameMatchStatus, { tone: VerificationTone; text: string }> = {
  match: { tone: "success", text: "Match" },
  "no-match": { tone: "danger", text: "No Match" },
  unable: { tone: "warning", text: "Unable to Compare" },
};

// Cheque name against the verified ID name (or the captured recipient name when no ID document was submitted):
// both names, the similarity, the threshold and the result. The same block is used on every role's page.
export default function ChequeNameCheck({ result, chequeName, comparedName, resolution }: ChequeNameCheckProps) {
  const pill = RESULT_PILL[result.status];
  const capturedName = result.source !== "id";
  const differenceKind = capturedName ? "captured recipient name" : "verified ID name";

  return (
    <InsetCard title="Cheque Name Check">
      <div className="flex items-center gap-4">
        <NameBox label={NAME_SOURCE_LABELS[result.source]} value={comparedName.trim() || "Not available"} />
        <NameBox label="Cheque Name" value={chequeName.trim() || "Not entered yet"} />
      </div>

      <dl className="mt-4 flex flex-col gap-2 text-base text-ink">
        {result.percent !== null && (
          <div className="flex items-center justify-between">
            <dt className="font-medium">Name Similarity:</dt>
            <dd>{result.percent}%</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="font-medium">Threshold:</dt>
          <dd>{result.thresholdPercent}%</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-medium">Result:</dt>
          <dd>
            <VerificationPill tone={pill.tone}>{pill.text}</VerificationPill>
          </dd>
        </div>
      </dl>

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

      {result.status === "no-match" && !resolution && (
        <div className="mt-4">
          <WarningAlert tone="danger" message="Names differ. The Authoriser records a reason before the payout is completed." />
        </div>
      )}

      {result.status === "no-match" && resolution && (
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
