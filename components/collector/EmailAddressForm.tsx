"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import { EMAIL_CAPTURE_KEY, type EmailCapture } from "@/lib/id-document-config";
import StepFormLayout from "./StepFormLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAddressForm() {
  const router = useRouter();
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
        router.push("/collector/primary-id");
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
