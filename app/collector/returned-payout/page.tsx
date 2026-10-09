import CollectorShell from "@/components/collector/CollectorShell";
import ReturnedPayoutView from "@/components/collector/ReturnedPayoutView";

export const metadata = { title: "Correct Returned Payout | Cruz Money" };

export default async function ReturnedPayoutPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <CollectorShell currentStep={5}>
      <ReturnedPayoutView type={type === "payment-file" ? "payment-file" : "cheque"} />
    </CollectorShell>
  );
}
