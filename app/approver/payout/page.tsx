import ApproverPayoutView from "@/components/approver/ApproverPayoutView";
import AppHeader from "@/components/layout/AppHeader";
import BackLink from "@/components/layout/BackLink";
import UserMenu from "@/components/layout/UserMenu";
import { MOCK_APPROVAL } from "@/lib/approver-data";

export const metadata = { title: "Approve Payout | Cruz Money" };

export default function ApproverPayoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader right={<UserMenu name={MOCK_APPROVAL.user} dashboardHref="/" />} />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <ApproverPayoutView />
      </main>
    </div>
  );
}
