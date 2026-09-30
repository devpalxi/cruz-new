import AuthoriserPayoutView from "@/components/authoriser/AuthoriserPayoutView";
import AppHeader from "@/components/layout/AppHeader";
import BackLink from "@/components/layout/BackLink";
import UserMenu from "@/components/layout/UserMenu";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";

export const metadata = { title: "Authorise Payout | Cruz Money" };

export default function AuthoriserPayoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader right={<UserMenu name={MOCK_AUTHORISATION.user} dashboardHref="/" />} />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <AuthoriserPayoutView />
      </main>
    </div>
  );
}
