"use client";

import type { InputHTMLAttributes } from "react";
import { CalendarIcon } from "./Icons";

// value is "YYYY-MM-DDTHH:mm"; displayed as "DD/MM/YYYY hh:mm am" regardless of browser locale.
function formatDisplay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return "";
  const [, y, mo, d, h, mi] = match;
  const hour = Number(h);
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = String(hour % 12 === 0 ? 12 : hour % 12).padStart(2, "0");
  return `${d}/${mo}/${y} ${hour12}:${mi} ${suffix}`;
}

type DateTimeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & {
  value: string;
};

export default function DateTimeInput({ value, className = "", ...props }: DateTimeInputProps) {
  return (
    <div
      className={`relative flex h-[4.375rem] w-full items-center rounded-md border border-line-date bg-surface px-[1.0625rem] text-xl text-ink focus-within:border-focus focus-within:ring-2 focus-within:ring-focus ${className}`}
    >
      <span>{formatDisplay(value)}</span>
      <CalendarIcon className="pointer-events-none absolute right-[0.9375rem] top-1/2 -translate-y-1/2 text-ink" />
      <input
        type="datetime-local"
        value={value}
        onClick={(e) => e.currentTarget.showPicker?.()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        {...props}
      />
    </div>
  );
}
