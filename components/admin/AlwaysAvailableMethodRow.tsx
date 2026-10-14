import StatusPill from "@/components/ui/StatusPill";
import Switch from "@/components/ui/Switch";

type AlwaysAvailableMethodRowProps = {
  title: string;
  description: string;
};

// A payment method the venue cannot switch off. It has the same card as the others, with an
// "Always available" badge and a switch that is fixed to On, so it is clear there is nothing to set.
export default function AlwaysAvailableMethodRow({ title, description }: AlwaysAvailableMethodRowProps) {
  return (
    <section className="rounded-xl bg-surface px-[1.9rem] py-[1.6rem]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-base text-subtle">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <StatusPill tone="successStrong" className="h-[1.875rem] shrink-0">
            Always available
          </StatusPill>
          <Switch id="always-available-method" checked disabled onChange={() => {}} label={`${title}, always on`} />
        </div>
      </div>
    </section>
  );
}
