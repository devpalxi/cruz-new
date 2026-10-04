import ApprovalView from "@/components/collector/ApprovalView";
import CollectorShell from "@/components/collector/CollectorShell";

export const metadata = { title: "Approval | Cruz Money" };

export default function ApprovalPage() {
  return (
    <CollectorShell currentStep={7}>
      <ApprovalView />
    </CollectorShell>
  );
}
