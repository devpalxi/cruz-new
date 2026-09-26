import type { InputHTMLAttributes } from "react";
import { CalendarIcon } from "./Icons";

export default function DateTimeInput({
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className="relative">
      <input
        type="datetime-local"
        lang="en-AU"
        className={`h-[70px] w-full rounded-md border border-line-date bg-surface px-[17px] pr-14 text-xl text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-14 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${className}`}
        {...props}
      />
      <CalendarIcon className="pointer-events-none absolute right-[15px] top-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
}
