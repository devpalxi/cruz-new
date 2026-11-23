"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import { EMAIL_CAPTURE_KEY, type EmailCapture } from "@/lib/id-document-config";
import { COLLECTOR_VENUE_ID } from "@/lib/collector-data";
import { IDV_REUSE_KEY, SHOWS_RETURNING_SCREEN, lookupReturningWinner } from "@/lib/returning-winner";
import { useVenues } from "@/lib/use-venues";
import StepFormLayout from "./StepFormLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAddressForm() {
  const router = useRouter();
  const { venues } = useVenues();
  const [email, setEmail] = useState("");
  const [membershipNumber, setMembershipNumber] = useState("");

  return (
    <StepFormLayout
      title="Email Address"
      backHref="/collector/before-you-start"
      nextDisabled={!EMAIL_PATTERN.test(email.trim())}
      onNext={() => {
        const capture: EmailCapture = { email: email.trim(), membershipNumber: membershipNumber.trim() };
        sessionStorage.setItem(EMAIL_CAPTURE_KEY, JSON.stringify(capture));
        // A new payout starts without a re-used identity check
        sessionStorage.removeItem(IDV_REUSE_KEY);
        // CRP-186: look the membership number up among this client's earlier winners. Only a match worth
        // deciding on shows the Returning Winner screen; everyone else goes straight to the ID screens.
        const venue = venues.find((v) => v.id === COLLECTOR_VENUE_ID) ?? null;
        const { status } = lookupReturningWinner(capture.membershipNumber, venue);
        router.push(SHOWS_RETURNING_SCREEN.includes(status) ? "/collector/returning-winner" : "/collector/primary-id");
      }}
    >
      <FormField label="Email" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Membership #" htmlFor="membership-number">
        <TextInput
          id="membership-number"
          placeholder="Membership Number"
          value={membershipNumber}
          onChange={(e) => setMembershipNumber(e.target.value)}
        />
      </FormField>
    </StepFormLayout>
  );
}
