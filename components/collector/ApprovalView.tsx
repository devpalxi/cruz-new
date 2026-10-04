import Button from "@/components/ui/Button";
import StatusPill from "@/components/ui/StatusPill";
import WarningAlert from "@/components/ui/WarningAlert";
import { MOCK_SUMMARY } from "@/lib/collector-data";

// The original Approval screen wasn't captured (it sits behind Submit), so this is a simple
// "submitted, awaiting approval" confirmation. The Approver and Authoriser take it from here.
export default function ApprovalView() {
  return (
    <div>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Payout #{MOCK_SUMMARY.payoutId}</h1>
      <div className="mt-6">
        <StatusPill tone="info">Awaiting Approval</StatusPill>
      </div>
      <div className="mt-[1.9375rem]">
        <WarningAlert
          tone="success"
          title="Payout submitted"
          message="An Approver will review this payout. You can close this page."
        />
      </div>
      <Button href="/" className="mt-[3.1875rem] h-[2.875rem] w-full">
        Back to Home
      </Button>
    </div>
  );
}
