import Switch from "@/components/ui/Switch";

type AlwaysAvailableMethodRowProps = {
  // Needed when more than one always-on card is on the page, so each switch has its own id
  id?: string;
  title: string;
  description?: string;
};

// A setting the venue cannot switch off (Electronic Fund Transfer, the EGM payout type). It has the same
// card as the others, with a switch that is fixed to On (disabled), so it is clear there is nothing to set.
export default function AlwaysAvailableMethodRow({ id = "always-available-method", title, description }: AlwaysAvailableMethodRowProps) {
  return (
    <section className="rounded-xl bg-surface px-[1.9rem] py-[1.6rem]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          {description && <p className="mt-1 text-base text-subtle">{description}</p>}
        </div>
        <Switch id={id} checked disabled onChange={() => {}} label={`${title}, always on`} />
      </div>
    </section>
  );
}
