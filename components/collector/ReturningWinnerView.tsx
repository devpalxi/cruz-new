"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import DetailList from "@/components/ui/DetailList";
import VerificationPill from "@/components/ui/VerificationPill";
import WarningAlert from "@/components/ui/WarningAlert";
import { COLLECTOR_VENUE_ID } from "@/lib/collector-data";
import { EMAIL_CAPTURE_KEY, ID_CAPTURE_KEY } from "@/lib/id-document-config";
import {
  IDV_REUSE_KEY,
  SHOWS_RETURNING_SCREEN,
  formatDate,
  fullName,
  lookupReturningWinner,
  savedWinnerRows,
  toIdCapture,
  type IdvReuse,
  type LookupResult,
} from "@/lib/returning-winner";
import { useVenues } from "@/lib/use-venues";

// Why a saved identity check can't be re-used, in the Collector's words
const REASONS: Partial<Record<LookupResult["status"], { title: string; message: (days: number) => string }>> = {
  "too-old": {
    title: "The last identity check is too old to re-use.",
    message: (days) => `This venue re-uses identity checks for ${days} days. Check the winner's ID again.`,
  },
  "document-expired": {
    title: "The ID document on file has expired.",
    message: () => "Check the winner's ID again with a current document.",
  },
  "not-passed": {
    title: "The last identity check did not pass.",
    message: () => "Only a passed identity check can be re-used. Check the winner's ID again.",
  },
};

// CRP-186: shown after the Email Address step when the membership number matches an earlier winner.
// The Collector re-uses the earlier identity check only if the winner says nothing has changed.
export default function ReturningWinnerView({ membershipOverride }: { membershipOverride?: string }) {
  const router = useRouter();
  const { venues, ready } = useVenues();
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    if (membershipOverride) {
      setMembershipNumber(membershipOverride);
      return;
    }
    try {
      const stored = sessionStorage.getItem(EMAIL_CAPTURE_KEY);
      setMembershipNumber(stored ? (JSON.parse(stored).membershipNumber ?? "") : "");
    } catch {
      setMembershipNumber("");
    }
  }, [membershipOverride]);

  if (!ready || membershipNumber === null) return null;

  const venue = venues.find((v) => v.id === COLLECTOR_VENUE_ID) ?? null;
  const result = lookupReturningWinner(membershipNumber, venue);
  const winner = result.winner;

  function checkAgain() {
    try {
      sessionStorage.removeItem(IDV_REUSE_KEY);
    } catch {
      // Nothing to clear
    }
    router.push("/collector/primary-id");
  }

  function reuse() {
    if (!winner) return;
    try {
      // Carry the saved details to the Summary, and note that no new check was run
      sessionStorage.setItem(ID_CAPTURE_KEY, JSON.stringify(toIdCapture(winner)));
      const reuseNote: IdvReuse = { payoutId: winner.lastCheck.payoutId, checkedAt: winner.lastCheck.checkedAt };
      sessionStorage.setItem(IDV_REUSE_KEY, JSON.stringify(reuseNote));
    } catch {
      // Storage blocked: the Summary falls back to its mock details
    }
    router.push("/collector/secondary-id");
  }

  const heading = <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Returning Winner</h1>;

  // Not a returning winner (or re-use is off): nothing to decide here
  if (!winner || !SHOWS_RETURNING_SCREEN.includes(result.status)) {
    return (
      <div className="flex flex-col gap-[2.125rem]">
        {heading}
        <p className="text-xl text-ink">No earlier identity check can be used for this winner. Continue to check their ID.</p>
        <Button onClick={checkAgain} className="h-[2.875rem] w-full">
          Continue to Primary ID
        </Button>
      </div>
    );
  }

  const checkedOn = formatDate(winner.lastCheck.checkedAt);

  if (result.status !== "reusable") {
    const reason = REASONS[result.status];
    return (
      <div className="flex flex-col gap-[2.125rem]">
        {heading}
        <p className="text-xl text-ink">
          {fullName(winner)} (Membership # {winner.membershipNumber}) was last identity checked on {checkedOn}.
        </p>
        {reason && <WarningAlert title={reason.title} message={reason.message(result.reuseDays ?? 0)} />}
        <div className="mt-[1.6875rem] flex gap-10">
          <Button variant="outline" href="/collector/email-address" className="h-[2.875rem] flex-1">
            Back
          </Button>
          <Button onClick={checkAgain} className="h-[2.875rem] flex-1">
            Check ID Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[2.125rem]">
      {heading}
      <p className="text-xl text-ink">
        This member was identity checked on {checkedOn} (payout #{winner.lastCheck.payoutId}).
      </p>

      <div className="flex flex-col gap-4 rounded-xl bg-surface px-[1.6rem] py-[1.4rem]">
        <div className="flex items-center justify-between gap-4 text-xl text-ink">
          <span className="font-semibold">Last Identity Check:</span>
          <VerificationPill tone="success">Pass</VerificationPill>
        </div>
        <DetailList rows={savedWinnerRows(winner)} />
      </div>

      <WarningAlert
        title="Ask the winner if any of these details have changed."
        message="If anything has changed, check their ID again. The bank account check still runs for this payout."
      />

      <div className="mt-[1.6875rem] flex flex-col gap-4">
        <div className="flex gap-10">
          <Button variant="outline" onClick={checkAgain} className="h-[2.875rem] flex-1">
            Details Have Changed, Check Again
          </Button>
          <Button onClick={reuse} className="h-[2.875rem] flex-1">
            Details Are the Same, Use These
          </Button>
        </div>
        <Button variant="ghost" href="/collector/email-address" className="h-[2.875rem] w-full">
          Back
        </Button>
      </div>
    </div>
  );
}
