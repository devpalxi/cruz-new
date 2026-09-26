import CollectorShell from "@/components/collector/CollectorShell";
import PayoutDetailsForm from "@/components/collector/PayoutDetailsForm";

export const metadata = { title: "Create New Payout | Cruz Money" };

export default function PayoutDetailsPage() {
  return (
    <CollectorShell currentStep={0}>
      <PayoutDetailsForm />
    </CollectorShell>
  );
}
