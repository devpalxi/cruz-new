import type { ReactNode } from "react";

type AmountCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  // When provided, renders a checkbox in the header and only shows children while checked.
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function AmountCard({
  icon,
  title,
  children,
  checked,
  onCheckedChange,
}: AmountCardProps) {
  const toggleable = onCheckedChange !== undefined;

  return (
    <section className="rounded-[1.25rem] border border-line-soft bg-surface px-[1.625rem] pb-[2.25rem] pt-[2.0625rem]">
      <div className="mb-[1.1875rem] flex h-[2.125rem] items-center justify-between gap-6 pl-2">
        <div className="flex items-center gap-6">
          <span className="text-icon-dark">{icon}</span>
          <h2 className="text-[1.375rem] font-semibold text-ink">{title}</h2>
        </div>
        {toggleable && (
          <input
            type="checkbox"
            aria-label={`Use ${title}`}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="h-[1.25rem] w-[1.25rem] cursor-pointer accent-brand"
          />
        )}
      </div>
      {(!toggleable || checked) && children}
    </section>
  );
}
