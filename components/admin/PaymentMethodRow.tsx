import type { ReactNode } from "react";
import Switch from "@/components/ui/Switch";

type PaymentMethodRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
};

// One payment method on the venue screen: title, one short line, an On/Off switch, and its own settings below when on
export default function PaymentMethodRow({ id, title, description, checked, onChange, children }: PaymentMethodRowProps) {
  const descriptionId = `${id}-description`;
  return (
    <section className="rounded-xl bg-surface px-[1.9rem] py-[1.6rem]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <label htmlFor={id} className="text-xl font-semibold text-ink">
            {title}
          </label>
          <p id={descriptionId} className="mt-1 text-base text-subtle">
            {description}
          </p>
        </div>
        <Switch id={id} checked={checked} onChange={onChange} label={title} describedBy={descriptionId} />
      </div>
      {checked && children && <div className="mt-5 flex flex-col gap-5 border-t border-line-soft pt-5">{children}</div>}
    </section>
  );
}
