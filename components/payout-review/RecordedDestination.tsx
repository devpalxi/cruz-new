import DetailList from "@/components/ui/DetailList";
import type { ReviewScenario } from "@/lib/payout-review-scenarios";
import { CHEQUE_MODES } from "@/lib/venue-data";

// Read-only summary of how the non-cash amount is paid, as recorded when the payout was submitted.
// Shown to the Approver and the Authoriser, so both see the same thing.
export default function RecordedDestination({ scenario }: { scenario: ReviewScenario }) {
  const isCheque = scenario.destinationType === "cheque";
  const isPaymentFile = scenario.destinationType === "manual-bank";
  const modeLabel = CHEQUE_MODES.find((m) => m.value === scenario.chequeMode)?.label;

  const rows = [
    { label: "Paid By", value: scenario.destinationTitle },
    { label: "Amount", value: `$${scenario.nonCashAmount}` },
    ...(isCheque
      ? [
          { label: "Cheque Details Entered By", value: modeLabel ?? "" },
          { label: "Cheque Number", value: scenario.cheque?.number || "Not entered yet" },
          { label: "Cheque Name", value: scenario.cheque?.name || "Not entered yet" },
        ]
      : scenario.accountRows),
  ];

  return (
    <div className="flex flex-col gap-3">
      <DetailList rows={rows} labelClassName="font-medium" />
      {isPaymentFile && (
        <p className="text-base text-subtle">
          This payment stays pending until your team includes it in a payment file and uploads that file to the bank.
        </p>
      )}
      {isCheque && (
        <p className="text-base text-subtle">
          The venue chose who enters the cheque details when this payout was submitted. Later changes to venue settings
          do not change it.
        </p>
      )}
    </div>
  );
}
