"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSections from "@/components/ui/CollapsibleSections";
import DetailList from "@/components/ui/DetailList";
import StatusPill from "@/components/ui/StatusPill";
import WarningAlert from "@/components/ui/WarningAlert";
import AmlScreening from "@/components/payout-review/AmlScreening";
import CollectorInfo from "@/components/payout-review/CollectorInfo";
import DocketRow from "@/components/payout-review/DocketRow";
import IdentityConfirmation from "@/components/payout-review/IdentityConfirmation";
import IdvHistoryTable from "@/components/payout-review/IdvHistoryTable";
import NameComparison from "@/components/payout-review/NameComparison";
import PayoutStatusNote from "@/components/payout-review/PayoutStatusNote";
import RecordedDestination from "@/components/payout-review/RecordedDestination";
import ReturnForCorrectionDialog from "@/components/payout-review/ReturnForCorrectionDialog";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";
import { chequeNeedsAuthoriser, comparedNameLabel, returnedTypeFor, type ReviewScenario } from "@/lib/payout-review-scenarios";
import { saveReturnedPayout } from "@/lib/return-payout";
import AuthorisationPanel from "./AuthorisationPanel";
import ChequeDetailsEditor, { type ChequeEditorState } from "./ChequeDetailsEditor";

export default function AuthoriserPayoutView({ scenario }: { scenario: ReviewScenario }) {
  const router = useRouter();
  const data = MOCK_AUTHORISATION;
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cheque, setCheque] = useState<ChequeEditorState>({ number: "", name: "", complete: false });
  const [returnOpen, setReturnOpen] = useState(false);

  const authoriserEntersCheque = chequeNeedsAuthoriser(scenario);
  const chequeComplete = cheque.complete;
  const canAuthorise = confirmed && (!authoriserEntersCheque || chequeComplete);

  // Cheque Details Entered By lists the people who actually entered details: the Collector (as recorded)
  // and the Authoriser once they have entered or changed something and checked it.
  const authoriserEntered =
    chequeComplete &&
    (cheque.number !== (scenario.cheque?.number ?? "") || cheque.name !== (scenario.cheque?.name ?? ""));
  const enteredBy = [...(scenario.chequeEnteredBy ?? []), ...(authoriserEntered ? [`${data.user} (Authoriser)`] : [])];

  // CoP (Confirmation of Payee) only applies to a real bank check. Cheque and the payment file
  // only get a name comparison, so the Approvals panel labels the result accordingly.
  const copLabel = scenario.destinationType === "cheque" ? "Cheque Verification" : "Account Name Check";

  const payoutRows = [
    { label: "Cash Amount", value: scenario.cashAmount },
    { label: `${scenario.destinationTitle} Amount`, value: scenario.nonCashAmount },
    ...data.payout.slice(2),
  ];

  return (
    <div className="rounded-xl bg-card p-5">
      <h1 className="text-[2.25rem] font-bold leading-[2.875rem] text-brand">Payout #{data.payoutId}</h1>

      <div className="mt-[1.125rem] flex items-center justify-between">
        <p className="text-lg text-subtle">{data.createdAt}</p>
        <div className="relative -top-1 flex items-center gap-[1.625rem] text-xl text-subtle">
          Status:
          <StatusPill tone="info" className="h-[1.875rem] px-2.5! text-[0.9375rem]!">
            {data.status}
          </StatusPill>
        </div>
      </div>
      <PayoutStatusNote scenario={scenario} />

      <div className="mt-[1.375rem]">
        <CollapsibleSections
          items={[
            {
              id: "payout",
              title: "Payout Details",
              content: (
                <>
                  <DetailList rows={payoutRows} labelClassName="font-medium" />
                  <DocketRow />
                </>
              ),
            },
            {
              id: "member",
              title: "Member Identification",
              content: (
                <>
                  <DetailList rows={data.member} labelClassName="font-medium" />
                  <IdentityConfirmation lines={data.identityConfirmation} />
                </>
              ),
            },
            {
              id: "bank",
              title: "Payment Method Details",
              content: authoriserEntersCheque ? (
                <RecordedDestination
                  scenario={scenario}
                  chequeEnteredBy={enteredBy}
                  chequeSlot={
                    <ChequeDetailsEditor
                      initialNumber={scenario.cheque?.number}
                      initialName={scenario.cheque?.name}
                      onChange={setCheque}
                    />
                  }
                />
              ) : (
                <RecordedDestination scenario={scenario} />
              ),
            },
            {
              id: "name",
              title: "Name Verification",
              content: <NameComparison {...data.nameVerification} otherLabel={comparedNameLabel(scenario)} />,
            },
            {
              id: "results",
              title: "Verification Results",
              content: <AmlScreening {...data.aml} />,
            },
            {
              id: "idv",
              title: "Identity Verification (IDV) History",
              content: <IdvHistoryTable rows={data.idvHistory} />,
            },
            { id: "collector", title: "Collector", content: <CollectorInfo {...data.collector} /> },
            {
              id: "approvals",
              title: "Approvals",
              content: (
                <AuthorisationPanel
                  copStatus={data.approvals.copStatus}
                  copLabel={copLabel}
                  idNameMatch={data.approvals.idNameMatch}
                  approverDecision={data.approverDecision}
                  note={note}
                  onNoteChange={setNote}
                  confirmed={confirmed}
                  onConfirmedChange={setConfirmed}
                />
              ),
            },
          ]}
        />
      </div>

      {authoriserEntersCheque && !chequeComplete && (
        <div className="mt-4">
          <WarningAlert message="Enter cheque details before authorising." />
        </div>
      )}

      <div className="mt-[0.9375rem] flex flex-col gap-3">
        <Button disabled={!canAuthorise} className="h-[2.8125rem] w-full">
          Authorise
        </Button>
        <Button
          variant="outline"
          onClick={() => setReturnOpen(true)}
          className="h-[2.8125rem] w-full"
        >
          Return for Correction
        </Button>
        <Button variant="danger" href="/" className="h-[2.8125rem] w-full">
          Reject
        </Button>
      </div>

      <ReturnForCorrectionDialog
        open={returnOpen}
        onCancel={() => setReturnOpen(false)}
        onConfirm={(reason) => {
          setReturnOpen(false);
          saveReturnedPayout(`${data.user} (Authoriser)`, reason);
          router.push(`/collector/returned-payout?type=${returnedTypeFor(scenario)}`);
        }}
      />
    </div>
  );
}
