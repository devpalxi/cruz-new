import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-[2.5rem] font-bold leading-[1.2] text-brand">Cruz Money</h1>
        <p className="mb-6 text-xl text-subtle">UI prototypes — choose a flow to preview.</p>
        <Button href="/collector/payout-details" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Collector Pages
        </Button>
        <Button href="/approver/payout" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Approver Pages
        </Button>
        <Button href="/authoriser/payout" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Authoriser Pages
        </Button>
        <Button href="/admin/dashboard" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Admin Pages
        </Button>
        <Button href="/admin/venues?role=super-admin" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Super Admin Pages
        </Button>
        <Button href="/payout-destination-scenarios" variant="outline" className="h-[2.875rem] w-[17.875rem]">
          Payout Destination Scenarios
        </Button>
      </main>
    </div>
  );
}
