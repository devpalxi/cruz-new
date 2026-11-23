import ApproverPayoutView from "@/components/approver/ApproverPayoutView";
import AppHeader from "@/components/layout/AppHeader";
import PayoutTypeSwitcher from "@/components/payout-review/PayoutTypeSwitcher";
import ScenarioSwitcher from "@/components/payout-review/ScenarioSwitcher";
import { parsePayoutTypeId } from "@/lib/payout-types";
import PrototypeSwitcher from "@/components/ui/PrototypeSwitcher";
import { IDV_REVIEW_OPTIONS } from "@/lib/returning-winner";
import { getReviewScenario } from "@/lib/payout-review-scenarios";
import BackLink from "@/components/layout/BackLink";
import UserMenu from "@/components/layout/UserMenu";
import { MOCK_APPROVAL } from "@/lib/approver-data";

export const metadata = { title: "Approve Payout | Cruz Money" };

export default async function ApproverPayoutPage({ searchParams }: { searchParams: Promise<{ scenario?: string; type?: string; idv?: string }> }) {
  const { scenario: scenarioId, type, idv } = await searchParams;
  const scenario = getReviewScenario(scenarioId, "funds-transfer");
  const payoutType = parsePayoutTypeId(type);
  const idvReused = idv === "reused";

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader right={<UserMenu name={MOCK_APPROVAL.user} dashboardHref="/" />} />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ScenarioSwitcher basePath="/approver/payout" current={scenario.id} payoutType={payoutType} />
        <PayoutTypeSwitcher basePath="/approver/payout" current={payoutType} keep={{ scenario: scenario.id, ...(idvReused ? { idv: "reused" } : {}) }} />
        <PrototypeSwitcher
          label="Identity check"
          basePath="/approver/payout"
          param="idv"
          options={IDV_REVIEW_OPTIONS}
          current={idvReused ? "reused" : "new"}
          keep={{ scenario: scenario.id, type: payoutType }}
        />
        <ApproverPayoutView scenario={scenario} payoutType={payoutType} idvReused={idvReused} />
      </main>
    </div>
  );
}
