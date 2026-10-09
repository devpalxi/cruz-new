import { RETURNED_PAYOUT_KEY } from "./payout-review-scenarios";

// Remembers who returned the payout and why. The caller then sends the reviewer to the Collector's correction page.
export function saveReturnedPayout(returnedBy: string, reason: string) {
  const returnedAt = new Date().toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" });
  try {
    sessionStorage.setItem(RETURNED_PAYOUT_KEY, JSON.stringify({ returnedBy, reason, returnedAt }));
  } catch {
    // Storage blocked: the correction page shows its sample reason instead
  }
}
