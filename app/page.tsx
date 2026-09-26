import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-[40px] font-bold leading-[1.2] text-brand">Cruz Money</h1>
        <p className="mb-6 text-xl text-subtle">UI prototypes — choose a flow to preview.</p>
        <Button href="/collector/payout-details" className="h-[46px] w-[286px]">
          Collector Pages
        </Button>
      </main>
    </div>
  );
}
