import InsetCard from "@/components/ui/InsetCard";
import StatusPill from "@/components/ui/StatusPill";

type AmlScreeningProps = {
  title: string;
  check: string;
  result: string;
};

export default function AmlScreening({ title, check, result }: AmlScreeningProps) {
  return (
    <InsetCard title={title}>
      <div className="flex h-[5.375rem] items-center justify-between rounded-md border border-line-soft bg-field px-[1.25rem]">
        <span className="text-lg font-semibold text-ink">{check}</span>
        <StatusPill tone="successStrong" className="h-[2.9375rem] rounded-lg px-[1.5rem] font-medium">
          {result}
        </StatusPill>
      </div>
    </InsetCard>
  );
}
