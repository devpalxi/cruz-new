"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSections, { type SectionItem } from "@/components/ui/CollapsibleSections";
import DetailList from "@/components/ui/DetailList";
import StatusPill from "@/components/ui/StatusPill";
import { MOCK_APPROVAL } from "@/lib/approver-data";
import AmlScreening from "@/components/payout-review/AmlScreening";
import ApprovalPanel from "./ApprovalPanel";
import CollectorInfo from "@/components/payout-review/CollectorInfo";
import DocketRow from "@/components/payout-review/DocketRow";
import IdentityConfirmation from "@/components/payout-review/IdentityConfirmation";
import IdvHistoryTable from "@/components/payout-review/IdvHistoryTable";
import ChequeNameCheck from "@/components/payout-review/ChequeNameCheck";
import ChequePaymentNote from "@/components/payout-review/ChequePaymentNote";
import NameCheckHistory from "@/components/payout-review/NameCheckHistory";
import NameComparison from "@/components/payout-review/NameComparison";
import PayoutStatusNote from "@/components/payout-review/PayoutStatusNote";
import RecordedDestination from "@/components/payout-review/RecordedDestination";
import ReturnForCorrectionDialog from "@/components/payout-review/ReturnForCorrectionDialog";
import { chequeWaitingFor } from "@/lib/cheque-payment-status";
import {
  comparedNameLabel,
  identityLinesFor,
  memberRowsFor,
  nameCheckFor,
  returnedTypeFor,
  type ReviewScenario,
} from "@/lib/payout-review-scenarios";
import { saveReturnedPayout } from "@/lib/return-payout";

export default function ApproverPayoutView({ scenario }: { scenario: ReviewScenario }) {
  const router = useRouter();
  const data = MOCK_APPROVAL;
  const [note, setNote] = useState("");
  const [risk, setRisk] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const hasBankDestination = scenario.destinationType === "bank";
  const isCheque = scenario.destinationType === "cheque";
  // The Approver only reads the cheque name check. The Authoriser records the rationale.
  const chequeName = scenario.cheque?.name ?? "";
  const nameResult = nameCheckFor(scenario, chequeName);
  const waitingFor = chequeWaitingFor({
    detailsEntered: Boolean(scenario.cheque?.number && scenario.cheque?.name),
    nameStatus: nameResult?.status ?? "match",
    nameResolved: Boolean(scenario.nameCheck?.resolution),
    hold: scenario.paymentHold,
  });

  const canApprove = risk !== "" && confirmed && (data.nameVerification.match || reviewed);

  const sections: (SectionItem | false)[] = [
    {
      id: "payout",
      title: "Payout Details",
      content: (
        <>
          <DetailList
            rows={[
              { label: "Cash Amount", value: scenario.cashAmount },
              { label: `${scenario.destinationTitle} Amount`, value: scenario.nonCashAmount },
              ...data.payout.slice(2),
            ]}
            labelClassName="font-medium"
          />
          <DocketRow />
        </>
      ),
    },
    {
      id: "member",
      title: "Member Identification",
      content: (
        <>
          <DetailList rows={memberRowsFor(scenario, data.member)} labelClassName="font-medium" />
          <IdentityConfirmation lines={identityLinesFor(scenario, data.identityConfirmation)} />
        </>
      ),
    },
    {
      id: "destination",
      title: "Payment Method Details",
      content: <RecordedDestination scenario={scenario} />,
    },
    hasBankDestination && {
      id: "name",
      title: "Name Verification",
      content: <NameComparison {...data.nameVerification} otherLabel={comparedNameLabel(scenario)} />,
    },
    isCheque &&
      nameResult !== null && {
        id: "name",
        title: "Name Verification",
        content: (
          <ChequeNameCheck
            result={nameResult}
            saved={scenario.nameCheck?.resolution}
            chequeName={chequeName}
            comparedName={scenario.nameCheck?.comparedName ?? ""}
          />
        ),
      },
    isCheque &&
      Boolean(scenario.nameCheck?.history?.length) && {
        id: "payout-history",
        title: "Payout History",
        content: <NameCheckHistory records={scenario.nameCheck?.history ?? []} />,
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
        <ApprovalPanel
          copStatus={data.approvals.copStatus}
          showCop={hasBankDestination}
          showNameMatch={!isCheque}
          nameMatch={data.approvals.nameMatch}
          reviewed={reviewed}
          onReviewedChange={setReviewed}
          note={note}
          onNoteChange={setNote}
          risk={risk}
          onRiskChange={setRisk}
          confirmed={confirmed}
          onConfirmedChange={setConfirmed}
        />
      ),
    },
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
      {isCheque && <ChequePaymentNote waitingFor={waitingFor} />}

      <div className="mt-[1.375rem]">
        <CollapsibleSections items={sections.filter((section): section is SectionItem => Boolean(section))} />
      </div>

      <div className="mt-[0.9375rem] flex flex-col gap-3">
        <Button disabled={!canApprove} className="h-[2.8125rem] w-full">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setReturnOpen(true)}
          className="h-[2.8125rem] w-full"
        >
          Return for Correction
        </Button>
        <Button variant="danger" href="/" className="h-[2.8125rem] w-full">
          Cancel
        </Button>
      </div>

      <ReturnForCorrectionDialog
        open={returnOpen}
        onCancel={() => setReturnOpen(false)}
        onConfirm={(reason) => {
          setReturnOpen(false);
          saveReturnedPayout(`${data.user} (Approver)`, reason);
          router.push(`/collector/returned-payout?type=${returnedTypeFor(scenario)}`);
        }}
      />
    </div>
  );
}
