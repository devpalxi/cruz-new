import type { ReviewScenario } from "@/lib/payout-review-scenarios";

// A short line under the status for a payout paid by Manual Bank Transfer, which stays pending after approval
export default function PayoutStatusNote({ scenario }: { scenario: ReviewScenario }) {
  if (scenario.destinationType !== "manual-bank") return null;
  return <p className="mt-1 text-right text-base text-subtle">Pending until included in a payment file.</p>;
}
