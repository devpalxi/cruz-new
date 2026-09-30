import AuthoriserHeader from "@/components/authoriser/AuthoriserHeader";
import AuthoriserPayoutView from "@/components/authoriser/AuthoriserPayoutView";
import BackLink from "@/components/layout/BackLink";

export const metadata = { title: "Authorise Payout | Cruz Money" };

export default function AuthoriserPayoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthoriserHeader />
      <div className="px-6 pt-[2rem]">
        <BackLink href="/">Dashboard</BackLink>
      </div>
      <main className="mx-auto mt-[1.5625rem] w-full max-w-[60rem] px-4 pb-12 sm:px-0">
        <AuthoriserPayoutView />
      </main>
    </div>
  );
}
