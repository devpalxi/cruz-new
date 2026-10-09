import VerificationPill from "@/components/ui/VerificationPill";
import ApproverDecision from "./ApproverDecision";

type AuthorisationPanelProps = {
  copStatus: string;
  // Bank Transfer runs a real Zepto CoP (Confirmation of Payee) check, so "Account Name Check" is
  // accurate there. Cheque and Manual Bank Transfer only compare names client-side, so the
  // caller passes a matching label instead of the CoP name.
  copLabel?: string;
  idNameMatch: string;
  approverDecision: { approvedBy: string; at: string; riskLevel: string; note: string };
  note: string;
  onNoteChange: (value: string) => void;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
};

export default function AuthorisationPanel({
  copStatus,
  copLabel = "Account Name Check",
  idNameMatch,
  approverDecision,
  note,
  onNoteChange,
  confirmed,
  onConfirmedChange,
}: AuthorisationPanelProps) {
  return (
    <div className="px-[0.9375rem] text-base text-label">
      <p className="flex items-center gap-2 text-base text-ink">
        {copLabel}:
        <VerificationPill tone="success">{copStatus}</VerificationPill>
      </p>
      <p className="mt-3 flex items-center gap-2 text-base text-ink">
        ID Name Match:
        <VerificationPill tone="success">{idNameMatch}</VerificationPill>
      </p>

      <div className="mt-[1.25rem]">
        <ApproverDecision {...approverDecision} />
      </div>

      <label htmlFor="authoriser-note" className="mt-[1.25rem] block text-base">
        Authoriser Note (optional)
      </label>
      <textarea
        id="authoriser-note"
        rows={2}
        placeholder="Add an authorisation note..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="mt-2 h-[4.375rem] w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
      />

      <div className="mt-[1.375rem] flex justify-end">
        <label className="flex cursor-pointer items-center gap-3 text-ink">
          I confirm this payout is authorised for payment release
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="h-[1.125rem] w-[1.125rem] cursor-pointer accent-brand"
          />
        </label>
      </div>
    </div>
  );
}
