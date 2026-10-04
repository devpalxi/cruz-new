import type { ReactNode } from "react";

type CheckboxRowProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

export default function CheckboxRow({ id, checked, onChange, children }: CheckboxRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-field px-[1.3125rem] py-4 text-lg text-ink"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 cursor-pointer accent-brand"
      />
      <span>{children}</span>
    </label>
  );
}
