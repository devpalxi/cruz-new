import type { NameMatchStatus } from "./name-match";
import type { ReviewScenario } from "./payout-review-scenarios";

type WaitingForInput = {
  detailsEntered: boolean;
  nameStatus: NameMatchStatus;
  // The Authoriser has recorded a rationale and ticked the acknowledgement (or a saved decision exists)
  nameResolved: boolean;
  hold: ReviewScenario["paymentHold"];
};

// What a cheque payout still needs before payment completes by itself. The status stays Pending Payment until none are left.
export function chequeWaitingFor({ detailsEntered, nameStatus, nameResolved, hold }: WaitingForInput): string[] {
  const waiting: string[] = [];
  if (!detailsEntered) waiting.push("cheque details");
  if (nameStatus === "no-match" && !nameResolved) waiting.push("name difference");
  if (hold?.waitRemaining) waiting.push(`waiting time (${hold.waitRemaining})`);
  if (hold?.dailyLimitReason) waiting.push("daily limit");
  return waiting;
}
