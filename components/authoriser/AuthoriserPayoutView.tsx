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
import RecordedDestination from "@/components/payout-review/RecordedDestination";
import ReturnForCorrectionDialog from "@/components/payout-review/ReturnForCorrectionDialog";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";
import { chequeNeedsAuthoriser, returnedTypeFor, type ReviewScenario } from "@/lib/payout-review-scenarios";
import { saveReturnedPayout } from "@/lib/return-payout";
import AuthorisationPanel from "./AuthorisationPanel";
import ChequeDetailsEditor from "./ChequeDetailsEditor";

export default function AuthoriserPayoutView({ scenario }: { scenario: ReviewScenario }) {
  const router = useRouter();
  const data = MOCK_AUTHORISATION;
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [chequeComplete, setChequeComplete] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const authoriserEntersCheque = chequeNeedsAuthoriser(scenario);
  const canAuthorise = confirmed && (!authoriserEntersCheque || chequeComplete);

  // CoP (Confirmation of Payee) only applies to a real bank check. Cheque and the payment file
  // only get a name comparison, so the Approvals panel labels the result accordingly.
  const copLabel =
    scenario.destinationType === "cheque"
      ? "Cheque Verification"
      : scenario.destinationType === "manual-bank"
        ? "Account Name Check"
        : "CoP Status";

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
              title: "Payout Destination Details",
              content: authoriserEntersCheque ? (
                <div className="flex flex-col gap-6">
                  <RecordedDestination scenario={scenario} />
                  <ChequeDetailsEditor
                    initialNumber={scenario.cheque?.number}
                    initialName={scenario.cheque?.name}
                    onCompleteChange={setChequeComplete}
                  />
                </div>
              ) : (
                <RecordedDestination scenario={scenario} />
              ),
            },
            {
              id: "name",
              title: "Name Verification",
              content: <NameComparison {...data.nameVerification} />,
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
          <WarningAlert
            title="Cheque details are needed before you can authorise."
            message="Enter the Cheque Number and Cheque Name under Payout Destination Details, then select Validate Cheque."
          />
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
