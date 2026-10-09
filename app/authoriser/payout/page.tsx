import AuthoriserHeader from "@/components/authoriser/AuthoriserHeader";
import AuthoriserPayoutView from "@/components/authoriser/AuthoriserPayoutView";
import ScenarioSwitcher from "@/components/payout-review/ScenarioSwitcher";
import { getReviewScenario } from "@/lib/payout-review-scenarios";
import BackLink from "@/components/layout/BackLink";

export const metadata = { title: "Authorise Payout | Cruz Money" };

export default async function AuthoriserPayoutPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getReviewScenario(scenarioId, "cheque-authoriser");

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthoriserHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ScenarioSwitcher basePath="/authoriser/payout" current={scenario.id} />
        <AuthoriserPayoutView scenario={scenario} />
      </main>
    </div>
  );
}
