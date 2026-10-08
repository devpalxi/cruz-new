import VerificationPill, { type VerificationTone } from "@/components/ui/VerificationPill";
import WarningAlert from "@/components/ui/WarningAlert";

type NameMatchStatusProps = {
  // Only Bank Transfer has a real Zepto CoP check to report.
  showCop?: boolean;
  copStatus?: string;
  copTone?: VerificationTone;
  // Shown only for an ambiguous "Close Match" — a clean Match or a clear No Match don't need it.
  copAlert?: { headline: string; message: string };
  // Label varies by destination: "ID Name Match" (Bank), "Account Name Match" (Manual Bank), "Bearer Name Match" (Cheque).
  nameMatchLabel?: string;
  match: boolean;
  reviewed: boolean;
  onReviewedChange: (value: boolean) => void;
};

export default function NameMatchStatus({
  showCop = true,
  copStatus,
  copTone = "success",
  copAlert,
  nameMatchLabel = "ID Name Match",
  match,
  reviewed,
  onReviewedChange,
}: NameMatchStatusProps) {
  return (
    <div className="text-base text-label">
      {showCop && copStatus && (
        <p className="flex items-center gap-2 text-[0.875rem]">
          CoP Status:
          <VerificationPill tone={copTone}>{copStatus}</VerificationPill>
        </p>
      )}

      {showCop && copAlert && (
        <div className="mt-3">
          <WarningAlert tone="warning" title={copAlert.headline} message={copAlert.message} />
        </div>
      )}

      <p className={`${showCop && copStatus ? "mt-3" : ""} flex items-center gap-2 text-base text-ink`}>
        {nameMatchLabel}:
        <VerificationPill tone={match ? "success" : "danger"}>{match ? "Yes" : "No"}</VerificationPill>
      </p>

      {!match && (
        <div className="mt-3 rounded-md border border-danger-line bg-danger-bg px-4 py-[0.9375rem]">
          <p className="text-[0.9375rem] leading-5 text-red-700">
            The name on the {showCop ? "bank account" : "payout destination"} does not match the name on the
            identity document. Please review the name comparison above and confirm if acceptable.
          </p>
          <label className="mt-2 flex cursor-pointer items-start gap-2 text-[0.9375rem] text-label">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => onReviewedChange(e.target.checked)}
              className="mt-0.5 h-[1.125rem] w-[1.125rem] cursor-pointer accent-brand"
            />
            I have reviewed the names and confirm the difference is acceptable.
          </label>
        </div>
      )}
    </div>
  );
}
