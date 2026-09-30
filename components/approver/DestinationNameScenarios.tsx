"use client";

import { useState } from "react";
import { DESTINATION_NAME_SCENARIOS } from "@/lib/approver-data";
import NameComparison from "@/components/payout-review/NameComparison";
import NameMatchStatus from "./NameMatchStatus";

// Reference: shows the two components that vary by payout destination — Name Verification and its
// Approvals status/warning — as they actually appear on the real page: in separate sections, not
// stacked together. Uses Bank Transfer's happy-path and mismatch states as the template; Manual
// Bank Transfer and Cheque follow the same pattern with showCop off and a different
// otherLabel/nameMatchLabel — see the other entries in DESTINATION_NAME_SCENARIOS (lib/approver-data.ts).
const bankScenarios = DESTINATION_NAME_SCENARIOS.filter((scenario) => scenario.type === "bank");

export default function DestinationNameScenarios() {
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col gap-12">
      {bankScenarios.map((scenario, index) => (
        <div key={scenario.label}>
          <p className="mb-4 text-base font-semibold text-label">{scenario.label}</p>

          <div className="flex flex-col gap-8">
            <section className="rounded-xl bg-card p-5">
              <h3 className="mb-4 text-xl font-semibold text-ink">Name Verification</h3>
              <NameComparison
                idName={scenario.idName}
                otherName={scenario.otherName}
                otherLabel={scenario.otherLabel}
                match={scenario.match}
              />
            </section>

            <section className="rounded-xl bg-card p-5">
              <h3 className="mb-4 text-xl font-semibold text-ink">Approvals</h3>
              <NameMatchStatus
                showCop={scenario.showCop}
                copStatus={scenario.copStatus}
                copTone={scenario.copTone}
                copAlert={scenario.copAlert}
                nameMatchLabel={scenario.nameMatchLabel}
                match={scenario.match}
                reviewed={reviewed[index] ?? false}
                onReviewedChange={(value) => setReviewed((prev) => ({ ...prev, [index]: value }))}
              />
            </section>
          </div>
        </div>
      ))}
    </div>
  );
}
