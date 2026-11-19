import Link from "next/link";
import { PAYOUT_TYPES, type PayoutTypeId } from "@/lib/payout-types";

type PayoutTypeSwitcherProps = {
  basePath: string;
  current: PayoutTypeId;
  // Other query values to keep on each link (for example the payment scenario)
  keep?: Record<string, string>;
};

// Prototype only: opens the same page for each payout type (CRP-461)
export default function PayoutTypeSwitcher({ basePath, current, keep = {} }: PayoutTypeSwitcherProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-base text-subtle">
      <span className="mr-1 font-semibold text-label">Prototype only. Payout type:</span>
      {PAYOUT_TYPES.map((type) => {
        const query = new URLSearchParams({ ...keep, type: type.id }).toString();
        return (
          <Link
            key={type.id}
            href={`${basePath}?${query}`}
            aria-current={type.id === current ? "page" : undefined}
            className={`rounded-full border px-3 py-1 ${
              type.id === current
                ? "border-brand bg-brand text-white"
                : "border-line bg-surface text-ink hover:border-brand"
            }`}
          >
            {type.label}
          </Link>
        );
      })}
    </div>
  );
}
