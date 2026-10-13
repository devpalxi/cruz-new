import type { ReactNode } from "react";
import DetailList from "@/components/ui/DetailList";
import type { ReviewScenario } from "@/lib/payout-review-scenarios";

type RecordedDestinationProps = {
  scenario: ReviewScenario;
  // The people who have entered cheque details so far. Defaults to what was recorded at submission.
  chequeEnteredBy?: string[];
  // Replaces the Cheque Number and Cheque Name rows, so the Authoriser can enter them inside this card
  chequeSlot?: ReactNode;
};

// Summary of how the non-cash amount is paid, as recorded when the payout was submitted.
// Shown to the Approver and the Authoriser, so both see the same thing.
export default function RecordedDestination({ scenario, chequeEnteredBy, chequeSlot }: RecordedDestinationProps) {
  const isCheque = scenario.destinationType === "cheque";
  const isPaymentFile = scenario.destinationType === "manual-bank";
  const enteredBy = chequeEnteredBy ?? scenario.chequeEnteredBy ?? [];

  const topRows = [
    { label: "Paid By", value: scenario.destinationTitle },
    { label: "Amount", value: `$${scenario.nonCashAmount}` },
    ...(isCheque
      ? [{ label: "Cheque Details Entered By", value: enteredBy.length > 0 ? enteredBy.join(", ") : "Not entered yet" }]
      : scenario.accountRows),
  ];
  const chequeRows = [
    { label: "Cheque Number", value: scenario.cheque?.number || "Not entered yet" },
    { label: "Cheque Name", value: scenario.cheque?.name || "Not entered yet" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <DetailList rows={topRows} labelClassName="font-medium" />
      {isCheque && (chequeSlot ?? <DetailList rows={chequeRows} labelClassName="font-medium" />)}
      {isPaymentFile && (
        <p className="text-base text-subtle">
          This payment stays pending until your team includes it in a payment file and uploads that file to the bank.
        </p>
      )}
    </div>
  );
}
