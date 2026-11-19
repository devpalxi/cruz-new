import AuthoriserHeader from "@/components/authoriser/AuthoriserHeader";
import AuthoriserPayoutView from "@/components/authoriser/AuthoriserPayoutView";
import PayoutTypeSwitcher from "@/components/payout-review/PayoutTypeSwitcher";
import ScenarioSwitcher from "@/components/payout-review/ScenarioSwitcher";
import { parsePayoutTypeId } from "@/lib/payout-types";
import { getReviewScenario } from "@/lib/payout-review-scenarios";
import BackLink from "@/components/layout/BackLink";

export const metadata = { title: "Authorise Payout | Cruz Money" };

export default async function AuthoriserPayoutPage({ searchParams }: { searchParams: Promise<{ scenario?: string; type?: string }> }) {
  const { scenario: scenarioId, type } = await searchParams;
  const scenario = getReviewScenario(scenarioId, "cheque-authoriser");
  const payoutType = parsePayoutTypeId(type);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthoriserHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ScenarioSwitcher basePath="/authoriser/payout" current={scenario.id} payoutType={payoutType} />
        <PayoutTypeSwitcher basePath="/authoriser/payout" current={payoutType} keep={{ scenario: scenario.id }} />
        <AuthoriserPayoutView scenario={scenario} payoutType={payoutType} />
      </main>
    </div>
  );
}
