import AccountNameValidationAlert from "@/components/collector/AccountNameValidationAlert";
import ChequeOptionalScenario from "@/components/collector/ChequeOptionalScenario";
import CopValidationCard from "@/components/collector/CopValidationCard";
import DestinationNameScenarios from "@/components/approver/DestinationNameScenarios";
import ChequeDetailsEditor from "@/components/authoriser/ChequeDetailsEditor";
import AppHeader from "@/components/layout/AppHeader";
import BackLink from "@/components/layout/BackLink";
import Button from "@/components/ui/Button";
import CollapsibleSections from "@/components/ui/CollapsibleSections";
import { SUMMARY_COP_SCENARIOS } from "@/lib/collector-data";

export const metadata = { title: "Payout Destination Name-Match Scenarios | Cruz Money" };

// Reference page only (not part of the collector/approver flow): shows, per role, only the
// components that vary between a matched, close-matched and unmatched payout destination name —
// not the full surrounding pages, since everything else stays identical either way.
export default function PayoutDestinationScenariosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-16 sm:px-0">
        <h1 className="mb-10 text-[2.25rem] font-bold leading-[2.875rem] text-brand">
          Payout Destination Name-Match Scenarios
        </h1>

        <section className="mb-14">
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">Collector — Manual Bank Transfer</h2>
          {/* Matches the real collector form column width (docs/design.md), not the wider reference page. */}
          <div className="flex max-w-[38.3125rem] flex-col gap-8">
            <div>
              <p className="mb-2 text-base font-semibold text-label">Match</p>
              <AccountNameValidationAlert
                tone="success"
                title="Account name matches bank records. Proceeding to summary."
              />
            </div>

            <div>
              <p className="mb-2 text-base font-semibold text-label">Close Match</p>
              <AccountNameValidationAlert
                tone="warning"
                title="Close match detected."
                messages={[
                  `The entered name "James O'Sullivan [CM]" is a close match to the registered account.`,
                  "You can update the bank details or proceed. If you proceed, this will be flagged for the approver.",
                ]}
                showActions
                confirmLabel="I confirm the payee wishes to proceed with the entered details despite the name difference."
                notesValue="only spelling changes are visible"
              />
              <div className="mt-4 flex gap-4">
                <Button variant="outline" className="h-[2.875rem] flex-1">
                  Validate Account
                </Button>
                <Button className="h-[2.875rem] flex-1">Next</Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-base font-semibold text-label">No Match</p>
              <AccountNameValidationAlert
                tone="danger"
                title="The account name does not match bank records."
                messages={[
                  "You can update the bank details or proceed. If you proceed, this will be flagged for the approver.",
                ]}
                showActions
                confirmLabel="I confirm the payee wishes to proceed with the entered details despite the no match result."
                notesPlaceholder="Add a note about this no match result, please avoid any sensitive information."
              />
              <div className="mt-4 flex gap-4">
                <Button variant="outline" className="h-[2.875rem] flex-1">
                  Validate Account
                </Button>
                <Button className="h-[2.875rem] flex-1">Next</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">Collector — Summary CoP Validation</h2>
          <p className="mb-4 text-base text-subtle">Bank Transfer — runs a real Zepto CoP check.</p>
          <div className="flex max-w-[38.3125rem] flex-col gap-8">
            {SUMMARY_COP_SCENARIOS.map((scenario) => (
              <div key={scenario.payoutId}>
                <p className="mb-2 text-base font-semibold text-label">{scenario.cop.status}</p>
                <CopValidationCard
                  status={scenario.cop.status}
                  headline={scenario.cop.headline}
                  message={scenario.cop.message}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">
            Collector — Summary Cheque Verification / Manual Bank Transfer Verification
          </h2>
          <p className="mb-4 text-base text-subtle">
            Manual Bank Transfer / Cheque — client-side name comparison only, no Close Match tier.
          </p>
          <div className="flex max-w-[38.3125rem] flex-col gap-8">
            {SUMMARY_COP_SCENARIOS.filter((scenario) => scenario.cop.status !== "Close Match").map((scenario) => (
              <div key={scenario.payoutId}>
                <p className="mb-2 text-base font-semibold text-label">{scenario.cop.status} — Cheque</p>
                <CopValidationCard status={scenario.cop.status} title="Cheque Verification" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex max-w-[38.3125rem] flex-col gap-8">
            {SUMMARY_COP_SCENARIOS.filter((scenario) => scenario.cop.status !== "Close Match").map((scenario) => (
              <div key={scenario.payoutId}>
                <p className="mb-2 text-base font-semibold text-label">{scenario.cop.status} — Manual Bank Transfer</p>
                <CopValidationCard status={scenario.cop.status} title="Manual Bank Transfer Verification" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">Approver — Bank Transfer</h2>
          <DestinationNameScenarios />
        </section>

        <section className="mb-14">
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">
            Collector — Cheque (Collector &amp; Authoriser both responsible)
          </h2>
          <p className="mb-4 text-base text-subtle">
            Venue setting: Cheque details can be collected by either role — the collector may skip
            it here and leave it for the authoriser.
          </p>
          <div className="max-w-[38.3125rem]">
            <ChequeOptionalScenario />
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-[1.5rem] font-semibold text-ink">
            Authoriser — Cheque (Authoriser responsible)
          </h2>
          <p className="mb-4 text-base text-subtle">
            Venue setting: Authoriser only, or Collector &amp; Authoriser both after a skip —
            cheque details become inline editable with their own Validate step.
          </p>
          <div className="max-w-[38.3125rem] rounded-xl bg-card p-5">
            <CollapsibleSections
              items={[{ id: "bank", title: "Payout Destination Details", content: <ChequeDetailsEditor /> }]}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
