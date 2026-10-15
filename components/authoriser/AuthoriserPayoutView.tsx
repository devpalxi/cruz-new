"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import ChequeNameCheck from "@/components/payout-review/ChequeNameCheck";
import ChequePaymentStatus from "@/components/payout-review/ChequePaymentStatus";
import NameCheckHistory from "@/components/payout-review/NameCheckHistory";
import NameComparison from "@/components/payout-review/NameComparison";
import PayoutStatusNote from "@/components/payout-review/PayoutStatusNote";
import RecordedDestination from "@/components/payout-review/RecordedDestination";
import ReturnForCorrectionDialog from "@/components/payout-review/ReturnForCorrectionDialog";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";
import { chequePaymentConditions } from "@/lib/cheque-payment-status";
import { evaluateNameMatch, type NameCheckRecord } from "@/lib/name-match";
import {
  chequeNeedsAuthoriser,
  comparedNameLabel,
  identityLinesFor,
  memberRowsFor,
  nameCheckFor,
  returnedTypeFor,
  type ReviewScenario,
} from "@/lib/payout-review-scenarios";
import { saveReturnedPayout } from "@/lib/return-payout";
import AuthorisationPanel from "./AuthorisationPanel";
import ChequeDetailsEditor, { type ChequeEditorState } from "./ChequeDetailsEditor";

const CHEQUE_RESULT_TEXT = { match: "Match", "no-match": "No Match", unable: "Unable to Compare" } as const;
const CHEQUE_RESULT_TONE = { match: "success", "no-match": "danger", unable: "warning" } as const;

export default function AuthoriserPayoutView({ scenario }: { scenario: ReviewScenario }) {
  const router = useRouter();
  const data = MOCK_AUTHORISATION;
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cheque, setCheque] = useState<ChequeEditorState>({ number: "", name: "", complete: false });
  const [returnOpen, setReturnOpen] = useState(false);
  // The rationale and acknowledgement belong to one pair of names. They are cleared when the names change.
  const [resolution, setResolution] = useState({ forName: "", rationale: "", acknowledged: false, at: "" });
  const [retired, setRetired] = useState<NameCheckRecord[]>([]);

  const authoriserEntersCheque = chequeNeedsAuthoriser(scenario);
  const chequeComplete = cheque.complete;

  // Entered By lists the people who actually entered details: the Collector (as recorded)
  // and the Authoriser once they have entered or changed something and checked it.
  const authoriserEntered =
    chequeComplete &&
    (cheque.number !== (scenario.cheque?.number ?? "") || cheque.name !== (scenario.cheque?.name ?? ""));
  const enteredBy = [...(scenario.chequeEnteredBy ?? []), ...(authoriserEntered ? [`${data.user} (Authoriser)`] : [])];

  // CoP (Confirmation of Payee) only applies to a real bank check. Cheque and the payment file
  // only get a name comparison, so the Approvals panel labels the result accordingly.
  const copLabel = scenario.destinationType === "cheque" ? "Cheque Verification" : "Account Name Check";

  const isCheque = scenario.destinationType === "cheque";
  const nameSource = scenario.nameCheck;
  // The name being checked: what the Authoriser has entered and checked, otherwise what was recorded at submission
  const chequeName = authoriserEntersCheque && chequeComplete ? cheque.name : (scenario.cheque?.name ?? "");
  const nameResult = nameCheckFor(scenario, chequeName);
  const comparedName = nameSource?.comparedName ?? "";

  const active =
    resolution.forName === chequeName ? resolution : { forName: chequeName, rationale: "", acknowledged: false, at: "" };
  const nameResolved = active.rationale.trim() !== "" && active.acknowledged;
  const nameBlocking = nameResult?.status === "no-match" && !nameResolved;

  const canAuthorise = confirmed && (!authoriserEntersCheque || chequeComplete) && !nameBlocking;

  const latest = useRef(resolution);
  useEffect(() => {
    latest.current = resolution;
  });
  // When the names change, a decision already made for the earlier names is kept as history and the new names start fresh.
  useEffect(() => {
    const previous = latest.current;
    if (previous.forName === chequeName) return;
    if (previous.rationale.trim() !== "" && previous.acknowledged && nameSource) {
      const earlier = evaluateNameMatch({ chequeName: previous.forName, comparedName, source: nameSource.source });
      setRetired((list) => [
        ...list,
        {
          id: `retired-${list.length}`,
          recordedAt: previous.at,
          authoriser: data.user,
          chequeName: previous.forName,
          comparedName,
          source: nameSource.source,
          percent: earlier.percent ?? 0,
          thresholdPercent: earlier.thresholdPercent,
          rationale: previous.rationale,
          acknowledged: true,
          active: false,
        },
      ]);
    }
    setResolution({ forName: chequeName, rationale: "", acknowledged: false, at: "" });
  }, [chequeName, comparedName, nameSource, data.user]);

  function updateResolution(changes: Partial<typeof resolution>) {
    const next = { ...active, ...changes, forName: chequeName };
    const done = next.rationale.trim() !== "" && next.acknowledged;
    setResolution({
      ...next,
      at: done ? next.at || new Date().toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" }) : "",
    });
  }

  const historyRecords: NameCheckRecord[] = [
    ...(nameSource?.history ?? []),
    ...retired,
    ...(nameResult?.status === "no-match" && nameResolved && nameResult.percent !== null && nameSource
      ? [
          {
            id: "active",
            recordedAt: active.at,
            authoriser: data.user,
            chequeName,
            comparedName,
            source: nameSource.source,
            percent: nameResult.percent,
            thresholdPercent: nameResult.thresholdPercent,
            rationale: active.rationale.trim(),
            acknowledged: true,
            active: true,
          },
        ]
      : []),
  ];

  const detailsEntered = authoriserEntersCheque
    ? chequeComplete
    : Boolean(scenario.cheque?.number && scenario.cheque?.name);
  const paymentConditions = chequePaymentConditions({
    detailsEntered,
    nameStatus: nameResult?.status ?? "match",
    nameResolved,
    hold: scenario.paymentHold,
  });

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
                  <DetailList rows={memberRowsFor(scenario, data.member)} labelClassName="font-medium" />
                  <IdentityConfirmation lines={identityLinesFor(scenario, data.identityConfirmation)} />
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
              content:
                isCheque && nameResult ? (
                  <ChequeNameCheck
                    result={nameResult}
                    chequeName={chequeName}
                    comparedName={comparedName}
                    resolution={{
                      rationale: active.rationale,
                      onRationaleChange: (rationale) => updateResolution({ rationale }),
                      acknowledged: active.acknowledged,
                      onAcknowledgedChange: (acknowledged) => updateResolution({ acknowledged }),
                    }}
                  />
                ) : (
                  <NameComparison {...data.nameVerification} otherLabel={comparedNameLabel(scenario)} />
                ),
            },
            ...(isCheque
              ? [
                  ...(historyRecords.length > 0
                    ? [{ id: "name-history", title: "Name Check History", content: <NameCheckHistory records={historyRecords} /> }]
                    : []),
                  {
                    id: "payment-status",
                    title: "Payment Status",
                    content: <ChequePaymentStatus conditions={paymentConditions} />,
                  },
                ]
              : []),
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
                  copStatus={isCheque && nameResult ? CHEQUE_RESULT_TEXT[nameResult.status] : data.approvals.copStatus}
                  copTone={isCheque && nameResult ? CHEQUE_RESULT_TONE[nameResult.status] : "success"}
                  copLabel={copLabel}
                  idNameMatch={isCheque && nameSource?.source !== "id" ? undefined : data.approvals.idNameMatch}
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

      {authoriserEntersCheque && !chequeComplete ? (
        <div className="mt-4">
          <WarningAlert message="Enter cheque details before authorising." />
        </div>
      ) : (
        nameBlocking && (
          <div className="mt-4">
            <WarningAlert message="Record a rationale and acknowledge the name difference before authorising." />
          </div>
        )
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
