import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "./Icons";
import { fieldClasses } from "./TextInput";

type Option = { value: string; label: string };

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholder?: string;
};

export default function SelectInput({
  options,
  placeholder = "Please Select",
  className = "",
  ...props
}: SelectInputProps) {
  return (
    <div className="relative">
      <select
        className={`${fieldClasses} cursor-pointer appearance-none pr-12 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-[1.3125rem] top-1/2 -translate-y-1/2 text-subtle" />
    </div>
  );
}
