type TabsProps<T extends string> = {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
};

export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-8 border-b border-line-soft">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-lg transition-colors ${
              selected ? "border-brand font-semibold text-brand" : "border-transparent text-subtle hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 text-[0.95rem] ${selected ? "bg-brand text-white" : "bg-line-soft text-label"}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
