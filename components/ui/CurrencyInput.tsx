import type { InputHTMLAttributes } from "react";

type CurrencyInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  currency?: string;
};

export default function CurrencyInput({
  currency = "AUD",
  disabled,
  className = "",
  ...props
}: CurrencyInputProps) {
  return (
    <div
      className={`flex h-[4.5rem] w-full items-center gap-5 rounded-lg border border-line px-[0.875rem] focus-within:border-focus focus-within:ring-2 focus-within:ring-focus ${
        disabled ? "bg-field-disabled text-muted" : "bg-field text-ink"
      } ${className}`}
    >
      <span className="text-[1.625rem] font-medium leading-none">$</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-xl outline-none disabled:cursor-not-allowed"
        {...props}
      />
      <span className="pt-1 text-base text-subtle">{currency}</span>
    </div>
  );
}
