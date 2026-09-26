import type { InputHTMLAttributes } from "react";

export const fieldClasses =
  "h-[4.5rem] w-full rounded-lg border border-line bg-field px-[1.3125rem] text-xl text-ink outline-none transition-shadow placeholder:text-subtle focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-muted disabled:placeholder:text-muted";

export default function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClasses} ${className}`} {...props} />;
}
