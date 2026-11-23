"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSections from "@/components/ui/CollapsibleSections";
import DetailList from "@/components/ui/DetailList";
import {
  AUTHORISER_ONLY_CHEQUE_DETAILS,
  MOCK_SUMMARY,
  PAYOUT_DESTINATION_DETAILS_KEY,
  type PayoutDestinationDetails,
} from "@/lib/collector-data";
import { EMAIL_CAPTURE_KEY, ID_CAPTURE_KEY, buildMemberIdentificationRows } from "@/lib/id-document-config";
import { evaluateNameMatch } from "@/lib/name-match";
import { DEFAULT_PAYOUT_TYPE, PAYOUT_TYPE_KEY, getPayoutType } from "@/lib/payout-types";
import { IDV_REUSE_KEY, formatDate, type IdvReuse } from "@/lib/returning-winner";
import ChequeNameCheck from "@/components/payout-review/ChequeNameCheck";
import CopValidationCard from "./CopValidationCard";

export default function SummaryView() {
  const { payoutId, createdAt, payment, member, destinations: fallbackDestinations, cop } = MOCK_SUMMARY;
  const [destinations, setDestinations] = useState<PayoutDestinationDetails[]>(fallbackDestinations);
  const [memberRows, setMemberRows] = useState(member);
  // Payout Type chosen on step 1; EGM when the step was skipped (prototype only)
  const [payoutType, setPayoutType] = useState({ id: DEFAULT_PAYOUT_TYPE as string, label: getPayoutType(DEFAULT_PAYOUT_TYPE).label });
  // A machine only applies to a gaming machine win
  const paymentRows = [
    { label: "Payout Type", value: payoutType.label },
    ...payment.filter((row) => payoutType.id === "egm" || row.label !== "Machine ID"),
  ];

  // CRP-186: set when the Collector re-used a returning winner's identity check
  const [idvReuse, setIdvReuse] = useState<IdvReuse | null>(null);
  const identityRows = idvReuse
    ? [
        ...memberRows,
        { label: "Identity Check", value: "Re-used" },
        { label: "Checked On", value: formatDate(idvReuse.checkedAt) },
      ]
    : memberRows;

  useEffect(() => {
    try {
      const storedReuse = sessionStorage.getItem(IDV_REUSE_KEY);
      if (storedReuse) setIdvReuse(JSON.parse(storedReuse));
    } catch {
      // No re-use note
    }
    try {
      const storedType = sessionStorage.getItem(PAYOUT_TYPE_KEY);
      if (storedType) setPayoutType(JSON.parse(storedType));
    } catch {
      // Keep EGM if the stored value can't be read.
    }
    try {
      const stored = sessionStorage.getItem(PAYOUT_DESTINATION_DETAILS_KEY);
      if (stored) setDestinations([JSON.parse(stored)]);
    } catch {
      // Keep the fallback destinations if the stored value can't be read.
    }
    try {
      // Show what the Email Address and Primary ID steps captured; otherwise keep the mock rows.
      const storedId = sessionStorage.getItem(ID_CAPTURE_KEY);
      if (storedId) {
        const storedEmail = sessionStorage.getItem(EMAIL_CAPTURE_KEY);
        setMemberRows(
          buildMemberIdentificationRows(JSON.parse(storedId), storedEmail ? JSON.parse(storedEmail) : null),
        );
      }
    } catch {
      // Keep the mock member rows if the stored value can't be read.
    }
  }, []);

  // With no cheque details yet there is nothing to verify, so no verification result is shown
  const chequeLeftToAuthoriser = destinations.some((d) =>
    d.rows.some((row) => row.value === AUTHORISER_ONLY_CHEQUE_DETAILS.rows[0].value),
  );

  // The cheque name is compared with the winner's name from the ID step. A blank name cannot be compared.
  const isCheque = destinations[0]?.type === "cheque";
  const savedChequeName = destinations[0]?.rows.find((row) => row.label === "Cheque Name")?.value ?? "";
  const chequeName = savedChequeName === "Not entered yet" ? "" : savedChequeName;
  const winnerName = memberRows.find((row) => row.label === "Full Name")?.value ?? "";
  const nameResult = evaluateNameMatch({ chequeName, comparedName: winnerName, source: "id" });

  return (
    <div>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Payout #{payoutId}</h1>
      <p className="mt-10 text-lg leading-6 text-subtle">{createdAt}</p>

      <div className="mt-[1.9375rem]">
        <CollapsibleSections
          items={[
            { id: "payment", title: "Payment Breakdown", content: <DetailList rows={paymentRows} /> },
            { id: "member", title: "Member Identification", content: <DetailList rows={identityRows} /> },
            {
              id: "destination",
              title: "Payment Method Details",
              content: (
                <div className="flex flex-col gap-6">
                  {destinations.map((destination) => (
                    <div key={destination.type}>
                      {destinations.length > 1 && (
                        <p className="mb-2 text-base font-semibold text-label">{destination.title}</p>
                      )}
                      <DetailList rows={destination.rows} />
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>

      {destinations.length > 0 && !chequeLeftToAuthoriser && (
        <div className="mt-[1.875rem]">
          {isCheque ? (
            <ChequeNameCheck result={nameResult} chequeName={chequeName} comparedName={winnerName} />
          ) : (
            <CopValidationCard
              status={cop.status}
              headline={cop.headline}
              message={cop.message}
              title={destinations[0].type === "manual-bank" ? "Manual Bank Transfer Verification" : "CoP Validation"}
            />
          )}
        </div>
      )}

      <div className="mt-[3.1875rem] flex gap-10">
        <Button variant="outline" href="/collector/payment-breakdown" className="h-[2.875rem] flex-1">
          Back
        </Button>
        <Button href="/collector/approval" className="h-[2.875rem] flex-1">
          Submit
        </Button>
      </div>
    </div>
  );
}
