import type { ReactNode } from "react";
import DetailList from "@/components/ui/DetailList";
import NotEnteredYet from "@/components/ui/NotEnteredYet";
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
  const enteredBy = chequeEnteredBy ?? scenario.chequeEnteredBy ?? [];

  const topRows = [
    { label: "Method", value: scenario.destinationTitle },
    { label: "Amount", value: `$${scenario.nonCashAmount}` },
    ...(isCheque
      ? [{ label: "Entered By", value: enteredBy.length > 0 ? enteredBy.join(", ") : <NotEnteredYet /> }]
      : scenario.accountRows),
  ];
  const chequeRows = [
    { label: "Cheque Number", value: scenario.cheque?.number || <NotEnteredYet /> },
    { label: "Cheque Name", value: scenario.cheque?.name || <NotEnteredYet /> },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* One list when the cheque rows are read-only, so every row is spaced the same */}
      <DetailList rows={isCheque && !chequeSlot ? [...topRows, ...chequeRows] : topRows} labelClassName="font-medium" />
      {isCheque && chequeSlot}
    </div>
  );
}
