"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSections from "@/components/ui/CollapsibleSections";
import DetailList from "@/components/ui/DetailList";
import {
  MOCK_SUMMARY,
  PAYOUT_DESTINATION_DETAILS_KEY,
  type PayoutDestinationDetails,
} from "@/lib/collector-data";
import { EMAIL_CAPTURE_KEY, ID_CAPTURE_KEY, buildMemberIdentificationRows } from "@/lib/id-document-config";
import CopValidationCard from "./CopValidationCard";

export default function SummaryView() {
  const { payoutId, createdAt, payment, member, destinations: fallbackDestinations, cop } = MOCK_SUMMARY;
  const [destinations, setDestinations] = useState<PayoutDestinationDetails[]>(fallbackDestinations);
  const [memberRows, setMemberRows] = useState(member);

  useEffect(() => {
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

  return (
    <div>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Payout #{payoutId}</h1>
      <p className="mt-10 text-lg leading-6 text-subtle">{createdAt}</p>

      <div className="mt-[1.9375rem]">
        <CollapsibleSections
          items={[
            { id: "payment", title: "Payment Breakdown", content: <DetailList rows={payment} /> },
            { id: "member", title: "Member Identification", content: <DetailList rows={memberRows} /> },
            {
              id: "destination",
              title: "Payout Destination Details",
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

      {destinations.length > 0 && (
        <div className="mt-[1.875rem]">
          <CopValidationCard
            status={cop.status}
            headline={cop.headline}
            message={cop.message}
            title={
              destinations[0].type === "cheque"
                ? "Cheque Verification"
                : destinations[0].type === "manual-bank"
                  ? "Manual Bank Transfer Verification"
                  : "CoP Validation"
            }
          />
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
