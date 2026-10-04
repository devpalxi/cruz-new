import CollectorShell from "@/components/collector/CollectorShell";
import SecondaryIdForm from "@/components/collector/SecondaryIdForm";

export const metadata = { title: "Secondary ID | Cruz Money" };

export default function SecondaryIdPage() {
  return (
    <CollectorShell currentStep={4}>
      <SecondaryIdForm />
    </CollectorShell>
  );
}
