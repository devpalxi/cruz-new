"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSections from "@/components/ui/CollapsibleSections";
import DetailList from "@/components/ui/DetailList";
import StatusPill from "@/components/ui/StatusPill";
import AmlScreening from "@/components/payout-review/AmlScreening";
import CollectorInfo from "@/components/payout-review/CollectorInfo";
import DocketRow from "@/components/payout-review/DocketRow";
import IdentityConfirmation from "@/components/payout-review/IdentityConfirmation";
import IdvHistoryTable from "@/components/payout-review/IdvHistoryTable";
import NameComparison from "@/components/payout-review/NameComparison";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";
import AuthorisationPanel from "./AuthorisationPanel";
import ChequeInlineEditScenario from "./ChequeInlineEditScenario";

export default function AuthoriserPayoutView() {
  const data = MOCK_AUTHORISATION;
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canAuthorise = confirmed;

  // CoP (Confirmation of Payee) only applies to a real Zepto bank check. Cheque and Manual Bank
  // Transfer destinations only get a client-side name comparison, so the Approvals panel below
  // labels the result accordingly instead of calling it "CoP Status".
  const copLabel =
    data.destinationType === "cheque"
      ? "Cheque Verification"
      : data.destinationType === "manual-bank"
        ? "Manual Bank Transfer Verification"
        : "CoP Status";

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
              id: "bank",
              title: "Payout Destination Details",
              // Venue setting: when the authoriser is responsible for cheque details, this
              // becomes inline editable with its own Validate step instead of read-only.
              content:
                data.destinationType === "cheque" ? (
                  <ChequeInlineEditScenario />
                ) : (
                  <DetailList rows={data.bank} labelClassName="font-medium" />
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

      <div className="mt-[0.9375rem] flex flex-col gap-3">
        <Button disabled={!canAuthorise} className="h-[2.8125rem] w-full">
          Authorise
        </Button>
        <Button variant="danger" href="/" className="h-[2.8125rem] w-full">
          Reject
        </Button>
      </div>
    </div>
  );
}
