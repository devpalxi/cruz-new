import WarningAlert from "@/components/ui/WarningAlert";
import WarningBadge from "@/components/ui/WarningBadge";

type CopValidationCardProps = {
  status: string;
  headline: string;
  message: string;
};

export default function CopValidationCard({ status, headline, message }: CopValidationCardProps) {
  return (
    <section className="rounded-xl border border-line-soft bg-page px-[1.3125rem] pb-[1.1875rem] pt-[1.375rem]">
      <h2 className="text-xl font-semibold leading-7 text-ink">CoP Validation</h2>
      <div className="mt-[0.6875rem]">
        <WarningBadge>{status}</WarningBadge>
      </div>
      <div className="mt-3">
        <WarningAlert title={headline} message={message} />
      </div>
    </section>
  );
}
