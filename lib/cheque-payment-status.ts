import type { NameMatchStatus } from "./name-match";
import type { ReviewScenario } from "./payout-review-scenarios";

export type PaymentCondition = { label: string; done: boolean; detail?: string };

type ConditionInput = {
  detailsEntered: boolean;
  nameStatus: NameMatchStatus;
  // The Authoriser has recorded a rationale and ticked the acknowledgement
  nameResolved: boolean;
  hold: ReviewScenario["paymentHold"];
};

// What a cheque payout still needs before payment completes by itself. The status stays Pending Payment until all are met.
export function chequePaymentConditions({ detailsEntered, nameStatus, nameResolved, hold }: ConditionInput): PaymentCondition[] {
  const conditions: PaymentCondition[] = [
    {
      label: "Cheque details entered",
      done: detailsEntered,
      detail: detailsEntered ? undefined : "Cheque Number and Cheque Name must be entered and checked.",
    },
  ];
  if (nameStatus === "no-match") {
    conditions.push({
      label: "Name difference resolved",
      done: nameResolved,
      detail: nameResolved ? undefined : "The Authoriser records a rationale and acknowledges the difference.",
    });
  }
  if (hold?.waitRemaining) {
    conditions.push({ label: "Original waiting time", done: false, detail: `${hold.waitRemaining} remaining.` });
  }
  if (hold?.dailyLimitReason) {
    conditions.push({ label: "Daily limit", done: false, detail: hold.dailyLimitReason });
  }
  return conditions;
}
