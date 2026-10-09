import ApproverPayoutView from "@/components/approver/ApproverPayoutView";
import AppHeader from "@/components/layout/AppHeader";
import ScenarioSwitcher from "@/components/payout-review/ScenarioSwitcher";
import { getReviewScenario } from "@/lib/payout-review-scenarios";
import BackLink from "@/components/layout/BackLink";
import UserMenu from "@/components/layout/UserMenu";
import { MOCK_APPROVAL } from "@/lib/approver-data";

export const metadata = { title: "Approve Payout | Cruz Money" };

export default async function ApproverPayoutPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getReviewScenario(scenarioId, "funds-transfer");

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader right={<UserMenu name={MOCK_APPROVAL.user} dashboardHref="/" />} />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ScenarioSwitcher basePath="/approver/payout" current={scenario.id} />
        <ApproverPayoutView scenario={scenario} />
      </main>
    </div>
  );
}
