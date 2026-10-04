import CollectorShell from "@/components/collector/CollectorShell";
import EmailAddressForm from "@/components/collector/EmailAddressForm";

export const metadata = { title: "Email Address | Cruz Money" };

export default function EmailAddressPage() {
  return (
    <CollectorShell currentStep={2}>
      <EmailAddressForm />
    </CollectorShell>
  );
}
