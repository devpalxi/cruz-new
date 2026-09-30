import SelectInput from "@/components/ui/SelectInput";
import { RISK_LEVELS } from "@/lib/approver-data";
import NameMatchStatus from "./NameMatchStatus";

type ApprovalPanelProps = {
  showCop?: boolean;
  copStatus?: string;
  nameMatchLabel?: string;
  nameMatch: boolean;
  reviewed: boolean;
  onReviewedChange: (value: boolean) => void;
  note: string;
  onNoteChange: (value: string) => void;
  risk: string;
  onRiskChange: (value: string) => void;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
};

export default function ApprovalPanel({
  showCop = true,
  copStatus,
  nameMatchLabel,
  nameMatch,
  reviewed,
  onReviewedChange,
  note,
  onNoteChange,
  risk,
  onRiskChange,
  confirmed,
  onConfirmedChange,
}: ApprovalPanelProps) {
  return (
    <div className="px-[0.9375rem] text-base text-label">
      <NameMatchStatus
        showCop={showCop}
        copStatus={copStatus}
        nameMatchLabel={nameMatchLabel}
        match={nameMatch}
        reviewed={reviewed}
        onReviewedChange={onReviewedChange}
      />

      <label htmlFor="approver-note" className="mt-[1.25rem] block text-base">
        Approver Note (optional)
      </label>
      <textarea
        id="approver-note"
        rows={2}
        placeholder="Add an approval note..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="mt-2 h-[4.375rem] w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
      />

      <div className="mt-[1.375rem] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="risk-level">Risk Level</label>
          <div className="w-[12.5rem]">
            <SelectInput
              id="risk-level"
              options={RISK_LEVELS}
              placeholder="Select risk level"
              value={risk}
              onChange={(e) => onRiskChange(e.target.value)}
              className="h-[2.9375rem]! rounded-md! bg-surface! px-3! text-sm!"
            />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-ink">
          I confirm this transaction is ready for payment
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
