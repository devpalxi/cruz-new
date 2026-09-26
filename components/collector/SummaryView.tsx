import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import DetailList from "@/components/ui/DetailList";
import { MOCK_SUMMARY } from "@/lib/collector-data";
import CopValidationCard from "./CopValidationCard";

export default function SummaryView() {
  const { payoutId, createdAt, payment, member, bank, cop } = MOCK_SUMMARY;

  return (
    <div>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Payout #{payoutId}</h1>
      <p className="mt-10 text-lg leading-6 text-subtle">{createdAt}</p>

      <div className="mt-[1.9375rem]">
        <Accordion
          items={[
            { id: "payment", title: "Payment Breakdown", content: <DetailList rows={payment} /> },
            { id: "member", title: "Member Identification", content: <DetailList rows={member} /> },
            { id: "bank", title: "Bank Account Details", content: <DetailList rows={bank} /> },
          ]}
        />
      </div>

      <div className="mt-[1.875rem]">
        <CopValidationCard status={cop.status} headline={cop.headline} message={cop.message} />
      </div>

      <div className="mt-[3.1875rem] flex gap-10">
        <Button variant="outline" href="/collector/payment-breakdown" className="h-[2.875rem] flex-1">
          Back
        </Button>
        {/* Approval step not built yet */}
        <Button className="h-[2.875rem] flex-1">Submit</Button>
      </div>
    </div>
  );
}
