import AuthoriserHeader from "@/components/authoriser/AuthoriserHeader";
import AuthoriserPayoutView from "@/components/authoriser/AuthoriserPayoutView";
import PayoutTypeSwitcher from "@/components/payout-review/PayoutTypeSwitcher";
import ScenarioSwitcher from "@/components/payout-review/ScenarioSwitcher";
import { parsePayoutTypeId } from "@/lib/payout-types";
import PrototypeSwitcher from "@/components/ui/PrototypeSwitcher";
import { IDV_REVIEW_OPTIONS } from "@/lib/returning-winner";
import { getReviewScenario } from "@/lib/payout-review-scenarios";
import BackLink from "@/components/layout/BackLink";

export const metadata = { title: "Authorise Payout | Cruz Money" };

export default async function AuthoriserPayoutPage({ searchParams }: { searchParams: Promise<{ scenario?: string; type?: string; idv?: string }> }) {
  const { scenario: scenarioId, type, idv } = await searchParams;
  const scenario = getReviewScenario(scenarioId, "cheque-authoriser");
  const payoutType = parsePayoutTypeId(type);
  const idvReused = idv === "reused";

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthoriserHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ScenarioSwitcher basePath="/authoriser/payout" current={scenario.id} payoutType={payoutType} />
        <PayoutTypeSwitcher basePath="/authoriser/payout" current={payoutType} keep={{ scenario: scenario.id, ...(idvReused ? { idv: "reused" } : {}) }} />
        <PrototypeSwitcher
          label="Identity check"
          basePath="/authoriser/payout"
          param="idv"
          options={IDV_REVIEW_OPTIONS}
          current={idvReused ? "reused" : "new"}
          keep={{ scenario: scenario.id, type: payoutType }}
        />
        <AuthoriserPayoutView scenario={scenario} payoutType={payoutType} idvReused={idvReused} />
      </main>
    </div>
  );
}
