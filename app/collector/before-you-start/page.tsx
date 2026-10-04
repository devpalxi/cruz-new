import BeforeYouStartView from "@/components/collector/BeforeYouStartView";
import CollectorShell from "@/components/collector/CollectorShell";

export const metadata = { title: "Before You Start | Cruz Money" };

// Not a stepper item — it sits between Payment Breakdown and Email Address.
export default function BeforeYouStartPage() {
  return (
    <CollectorShell currentStep={1}>
      <BeforeYouStartView />
    </CollectorShell>
  );
}
