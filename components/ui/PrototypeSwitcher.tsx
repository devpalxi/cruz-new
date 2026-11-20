import Link from "next/link";

type PrototypeSwitcherProps = {
  label: string;
  basePath: string;
  // Query parameter this switcher sets
  param: string;
  options: { value: string; label: string }[];
  current: string;
  // Other query values to keep on each link
  keep?: Record<string, string>;
};

// Prototype only: a row of links that opens the same page in each demo state
export default function PrototypeSwitcher({ label, basePath, param, options, current, keep = {} }: PrototypeSwitcherProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-base text-subtle">
      <span className="mr-1 font-semibold text-label">Prototype only. {label}:</span>
      {options.map((option) => {
        const query = new URLSearchParams({ ...keep, [param]: option.value }).toString();
        return (
          <Link
            key={option.value}
            href={`${basePath}?${query}`}
            aria-current={option.value === current ? "page" : undefined}
            className={`rounded-full border px-3 py-1 ${
              option.value === current
                ? "border-brand bg-brand text-white"
                : "border-line bg-surface text-ink hover:border-brand"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
