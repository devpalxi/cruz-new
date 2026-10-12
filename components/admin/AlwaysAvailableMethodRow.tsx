type AlwaysAvailableMethodRowProps = {
  title: string;
  description: string;
};

// A payment method the venue cannot switch off. It looks different from the switchable cards so it is not mistaken for a setting.
export default function AlwaysAvailableMethodRow({ title, description }: AlwaysAvailableMethodRowProps) {
  return (
    <section className="flex items-start justify-between gap-6 rounded-xl border border-line-soft px-[1.9rem] py-[1.3rem]">
      <div>
        <h3 className="text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-base text-subtle">{description}</p>
      </div>
      <span className="shrink-0 pt-0.5 text-base font-medium text-subtle">Always available</span>
    </section>
  );
}
