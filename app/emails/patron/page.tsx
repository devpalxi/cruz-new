import PatronEmailsView from "@/components/emails/PatronEmailsView";
import AppHeader from "@/components/layout/AppHeader";
import BackLink from "@/components/layout/BackLink";
import PayoutTypeSwitcher from "@/components/payout-review/PayoutTypeSwitcher";
import { parsePayoutTypeId } from "@/lib/payout-types";

export const metadata = { title: "Patron Emails | Cruz Money" };

export default async function PatronEmailsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const payoutType = parsePayoutTypeId(type);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Home</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[50rem] px-4 pb-12 sm:px-0">
        <PayoutTypeSwitcher basePath="/emails/patron" current={payoutType} />
        <PatronEmailsView payoutType={payoutType} />
      </main>
    </div>
  );
}
