"use client";

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
import NameComparison from "@/components/payout-review/NameComparison";

export default function ApproverPayoutView() {
  const data = MOCK_APPROVAL;
  const [note, setNote] = useState("");
  const [risk, setRisk] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const hasBankDestination = data.destinations.some((destination) => destination.type === "bank");
  const canApprove = risk !== "" && confirmed && (data.nameVerification.match || reviewed);

  const sections: (SectionItem | false)[] = [
    {
      id: "payout",
      title: "Payout Details",
      content: (
        <>
          <DetailList rows={data.payout} labelClassName="font-medium" />
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
      id: "destination",
      title: "Payout Destination Details",
      content: (
        <div className="flex flex-col gap-6">
          {data.destinations.map((destination) => (
            <div key={destination.type}>
              {data.destinations.length > 1 && (
                <p className="mb-2 text-base font-medium text-label">{destination.title}</p>
              )}
              <DetailList rows={destination.rows} labelClassName="font-medium" />
            </div>
          ))}
        </div>
      ),
    },
    hasBankDestination && {
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
        <ApprovalPanel
          copStatus={data.approvals.copStatus}
          showCop={hasBankDestination}
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

      <div className="mt-[1.375rem]">
        <CollapsibleSections items={sections.filter((section): section is SectionItem => Boolean(section))} />
      </div>

      <div className="mt-[0.9375rem] flex flex-col gap-3">
        <Button disabled={!canApprove} className="h-[2.8125rem] w-full">
          Approve
        </Button>
        <Button variant="danger" href="/" className="h-[2.8125rem] w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
}
