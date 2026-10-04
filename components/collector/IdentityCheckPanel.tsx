"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import CheckboxRow from "@/components/ui/CheckboxRow";
import WarningAlert from "@/components/ui/WarningAlert";
import type { IdCheckResult } from "@/lib/id-document-config";
import IdCheckActionRow from "./IdCheckActionRow";

type Outcome = "passed" | "unavailable";
type Status = "idle" | "running" | Outcome;

type IdentityCheckPanelProps = {
  // Manual KYC has no electronic check — only the physical-verification attestation.
  manual: boolean;
  onBack: () => void;
  onComplete: (result: IdCheckResult) => void;
};

const CONSENT_TEXT =
  "You have obtained consent from your customer to the collection, use and disclosure of their personal information in accordance with your Privacy Policy, and for the purposes of verifying their identity. They consent to: (a) the verification of their personal information with a credit bureau header file (for verification only); (b) against records held by official document issuers or official record holders via third party systems; and (c) your verification agent(s) acting as a nominated intermediary in accordance with Australian Privacy Principles. They consent to the use by third parties of the results of any verification checks on their identity for the purposes of monitoring and improving the verification services.";

export default function IdentityCheckPanel({ manual, onBack, onComplete }: IdentityCheckPanelProps) {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  // Prototype only: there is no real FrankieOne call, so the reviewer picks the outcome to see.
  const [simulate, setSimulate] = useState<Outcome>("passed");
  const [bypass, setBypass] = useState(false);
  const [attested, setAttested] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function runCheck() {
    setStatus("running");
    timer.current = setTimeout(() => setStatus(simulate), 1200);
  }

  function reset() {
    setStatus("idle");
    setBypass(false);
    setAttested(false);
  }

  if (manual) {
    return (
      <div className="flex flex-col gap-[1.375rem]">
        <CheckboxRow id="manual-attestation" checked={attested} onChange={setAttested}>
          I have physically viewed and verified this document
        </CheckboxRow>
        <IdCheckActionRow onBack={onBack} label="Continue" disabled={!attested} onClick={() => onComplete("manual")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[1.375rem]">
      <div>
        <p className="text-base font-semibold text-brand">Customer Consent</p>
        <div className="mt-2">
          <CheckboxRow id="customer-consent" checked={consent} onChange={setConsent}>
            <span className="text-base leading-6">{CONSENT_TEXT}</span>
          </CheckboxRow>
        </div>
      </div>

      {status === "passed" && <WarningAlert tone="success" title="Identity verified" />}

      {status === "unavailable" && (
        <div className="flex flex-col gap-4">
          <WarningAlert tone="danger" title="Identity verification server is currently unavailable" />
          <CheckboxRow id="bypass-validation" checked={bypass} onChange={setBypass}>
            I want to bypass identity validation
          </CheckboxRow>
          {bypass && (
            <CheckboxRow id="bypass-attestation" checked={attested} onChange={setAttested}>
              I have manually verified the customer&apos;s identity document and confirm it is valid
            </CheckboxRow>
          )}
          <Button variant="ghost" onClick={reset} className="h-[2.875rem] w-full">
            Try again
          </Button>
        </div>
      )}

      {(status === "idle" || status === "running") && (
        <div className="rounded-lg border border-dashed border-line p-4">
          <p className="text-base font-semibold text-label">Prototype only — simulated result</p>
          <div className="mt-3 flex gap-4">
            <Button
              variant={simulate === "passed" ? "primary" : "ghost"}
              onClick={() => setSimulate("passed")}
              className="h-[2.5rem] flex-1"
            >
              Pass
            </Button>
            <Button
              variant={simulate === "unavailable" ? "primary" : "ghost"}
              onClick={() => setSimulate("unavailable")}
              className="h-[2.5rem] flex-1"
            >
              Server unavailable
            </Button>
          </div>
        </div>
      )}

      {status === "passed" || status === "unavailable" ? (
        <IdCheckActionRow
          onBack={onBack}
          label="Continue"
          disabled={status === "unavailable" && !(bypass && attested)}
          onClick={() => onComplete(status === "passed" ? "passed" : "bypassed")}
        />
      ) : (
        <IdCheckActionRow
          onBack={onBack}
          label={status === "running" ? "Running identity check…" : "Run Identity Check"}
          disabled={!consent || status === "running"}
          onClick={runCheck}
        />
      )}
    </div>
  );
}
