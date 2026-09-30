"use client";

import { useState } from "react";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { MOCK_WINNER_NAME } from "@/lib/collector-data";

// Collector & Authoriser both responsible for cheque details: the collector can fill them in now
// or skip and leave it for the authoriser — unlike the Collector-only setup, where they're
// mandatory here. Mirrors the Secondary ID (Optional) step's info box + skip pattern.
export default function ChequeOptionalScenario() {
  const [skip, setSkip] = useState(false);
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeName, setChequeName] = useState(MOCK_WINNER_NAME);

  return (
    <div className="rounded-xl border border-line-soft bg-surface p-5">
      <div className="rounded-lg bg-[#ebf5ff] p-4">
        <p className="text-lg leading-[1.75rem] text-blue-800">
          <span className="font-semibold">Cheque details are optional here</span>
          <br />
          You can provide the cheque information now, or skip this step if needed.
        </p>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-field px-[1.3125rem] py-4 text-lg text-ink">
        <input
          type="checkbox"
          checked={skip}
          onChange={(e) => setSkip(e.target.checked)}
          className="h-[1.125rem] w-[1.125rem] cursor-pointer accent-brand"
        />
        Skip cheque details
      </label>

      {!skip && (
        <div className="mt-4 flex flex-col gap-[1.375rem]">
          <FormField label="Cheque Number" htmlFor="cheque-optional-number">
            <TextInput
              id="cheque-optional-number"
              value={chequeNumber}
              onChange={(e) => setChequeNumber(e.target.value)}
            />
          </FormField>
          <FormField label="Cheque Name" htmlFor="cheque-optional-name">
            <TextInput
              id="cheque-optional-name"
              value={chequeName}
              onChange={(e) => setChequeName(e.target.value)}
            />
          </FormField>
        </div>
      )}

      <Button className="mt-5 h-[2.875rem] w-full">Next</Button>
    </div>
  );
}
