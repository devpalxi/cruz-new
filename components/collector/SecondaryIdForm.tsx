"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import CheckboxRow from "@/components/ui/CheckboxRow";
import { SELECTED_DESTINATION_KEY } from "@/lib/collector-data";
import MedicareCardForm, { EMPTY_MEDICARE } from "./MedicareCardForm";

export default function SecondaryIdForm() {
  const router = useRouter();
  const [skip, setSkip] = useState(false);
  const [showMedicare, setShowMedicare] = useState(false);
  const [medicare, setMedicare] = useState(EMPTY_MEDICARE);

  // A non-cash destination picked on Payment Breakdown needs its details captured next;
  // a cash-only payout goes straight to the Summary.
  function continueFlow() {
    const destination = sessionStorage.getItem(SELECTED_DESTINATION_KEY);
    router.push(destination ? "/collector/payout-destination-details" : "/collector/summary");
  }

  if (showMedicare) {
    return (
      <MedicareCardForm
        details={medicare}
        onChange={setMedicare}
        onBack={() => setShowMedicare(false)}
        onNext={continueFlow}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        Secondary Identification (Optional)
      </h1>

      <div className="rounded-lg bg-[#ebf5ff] p-4">
        <p className="text-lg leading-[1.75rem] text-blue-800">
          <span className="font-semibold">Secondary ID helps verify your identity</span>
          <br />
          You can provide a Medicare card as additional verification, or skip this step if needed.
        </p>
      </div>

      <div className="mt-[1.375rem]">
        <CheckboxRow id="skip-secondary-id" checked={skip} onChange={setSkip}>
          Skip secondary ID verification
        </CheckboxRow>
      </div>

      {skip ? (
        <Button variant="soft" onClick={continueFlow} className="mt-[1.375rem] h-[2.875rem] w-full">
          Continue Without Secondary ID
        </Button>
      ) : (
        <Button onClick={() => setShowMedicare(true)} className="mt-[1.375rem] h-[2.875rem] w-full">
          Medicare Card
        </Button>
      )}

      <Button variant="outline" href="/collector/primary-id" className="mt-4 h-[2.875rem] w-full">
        Back
      </Button>
    </div>
  );
}
