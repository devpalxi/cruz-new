import InsetCard from "@/components/ui/InsetCard";

type ApproverDecisionProps = {
  approvedBy: string;
  at: string;
  riskLevel: string;
  note: string;
};

// Read-only summary of the approver's sign-off, carried into the authoriser's dual sign-off.
export default function ApproverDecision({ approvedBy, at, riskLevel, note }: ApproverDecisionProps) {
  return (
    <InsetCard title="Approver Decision">
      <div className="flex items-center justify-between text-base text-ink">
        <span>
          Approved by <span className="font-medium">{approvedBy}</span>
        </span>
        <span className="text-subtle">{at}</span>
      </div>
      <p className="mt-2 text-base text-ink">
        Risk Level: <span className="font-medium">{riskLevel}</span>
      </p>
      {note && <p className="mt-2 text-base leading-6 text-label">&ldquo;{note}&rdquo;</p>}
    </InsetCard>
  );
}
