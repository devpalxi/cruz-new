import CollectorShell from "@/components/collector/CollectorShell";
import PrimaryIdFlow from "@/components/collector/PrimaryIdFlow";

export const metadata = { title: "Primary ID Document | Cruz Money" };

export default function PrimaryIdPage() {
  return (
    <CollectorShell currentStep={3}>
      <PrimaryIdFlow />
    </CollectorShell>
  );
}
