import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-[2.5rem] font-bold leading-[1.2] text-brand">Cruz Money</h1>
        <p className="mb-6 text-xl text-subtle">UI prototypes — choose a flow to preview.</p>
        <Button href="/collector/payout-details" className="h-[2.875rem] w-[17.875rem]">
          Collector Pages
        </Button>
        <Button href="/approver/payout" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Approver Pages
        </Button>
        <Button href="/authoriser/payout" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Authoriser Pages
        </Button>
      </main>
    </div>
  );
}
