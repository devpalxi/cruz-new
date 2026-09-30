import type { InputHTMLAttributes } from "react";

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string };

export default function DateInput({ label, id, className = "", ...props }: DateInputProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-[0.95rem] uppercase tracking-wide text-label">
      {label}
      <input
        id={id}
        type="date"
        className={`h-[3.1rem] rounded-md border border-line bg-surface px-3 text-lg normal-case tracking-normal text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus ${className}`}
        {...props}
      />
    </label>
  );
}
