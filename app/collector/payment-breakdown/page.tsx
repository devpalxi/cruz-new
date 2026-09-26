import CollectorShell from "@/components/collector/CollectorShell";
import PaymentBreakdownForm from "@/components/collector/PaymentBreakdownForm";

export const metadata = { title: "Payout Details | Cruz Money" };

export default function PaymentBreakdownPage() {
  return (
    <CollectorShell currentStep={1}>
      <PaymentBreakdownForm />
    </CollectorShell>
  );
}
