import Link from "next/link";
import { REVIEW_SCENARIOS, type ReviewScenarioId } from "@/lib/payout-review-scenarios";

type ScenarioSwitcherProps = {
  basePath: string;
  current: ReviewScenarioId;
};

// Prototype only: lets a viewer open the same review page for each way of paying
export default function ScenarioSwitcher({ basePath, current }: ScenarioSwitcherProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-base text-subtle">
      <span className="mr-1 font-semibold text-label">Prototype only. Payout paid by:</span>
      {REVIEW_SCENARIOS.map((scenario) => (
        <Link
          key={scenario.id}
          href={`${basePath}?scenario=${scenario.id}`}
          aria-current={scenario.id === current ? "page" : undefined}
          className={`rounded-full border px-3 py-1 ${
            scenario.id === current
              ? "border-brand bg-brand text-white"
              : "border-line bg-surface text-ink hover:border-brand"
          }`}
        >
          {scenario.switcherLabel}
        </Link>
      ))}
    </div>
  );
}
