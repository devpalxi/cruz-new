import type { ReactNode } from "react";

type AmountCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export default function AmountCard({ icon, title, children }: AmountCardProps) {
  return (
    <section className="rounded-[1.25rem] border border-line-soft bg-surface px-[1.625rem] pb-[2.25rem] pt-[2.0625rem]">
      <div className="mb-[1.1875rem] flex h-[2.125rem] items-center gap-6 pl-2">
        <span className="text-icon-dark">{icon}</span>
        <h2 className="text-[1.375rem] font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}
