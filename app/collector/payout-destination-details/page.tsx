import CollectorShell from "@/components/collector/CollectorShell";
import PayoutDestinationDetailsForm from "@/components/collector/PayoutDestinationDetailsForm";

export const metadata = { title: "Payment Method Details | Cruz Money" };

export default function PayoutDestinationDetailsPage() {
  return (
    <CollectorShell currentStep={5}>
      <PayoutDestinationDetailsForm />
    </CollectorShell>
  );
}
