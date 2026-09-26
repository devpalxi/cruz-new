import CollectorShell from "@/components/collector/CollectorShell";
import SummaryView from "@/components/collector/SummaryView";

export const metadata = { title: "Payout Summary | Cruz Money" };

export default function SummaryPage() {
  return (
    <CollectorShell currentStep={6}>
      <SummaryView />
    </CollectorShell>
  );
}
