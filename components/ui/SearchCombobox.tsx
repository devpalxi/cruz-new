"use client";

import { useEffect, useRef, useState } from "react";
import { fieldClasses } from "./TextInput";

export type ComboboxOption = {
  value: string;
  title: string;
  meta: string;
};

type SearchComboboxProps = {
  id?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  disabledPlaceholder?: string;
  emptyText?: string;
};

export default function SearchCombobox({
  id,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Search...",
  disabledPlaceholder = "",
  emptyText = "No results found",
}: SearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    `${o.title} ${o.meta}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        disabled={disabled}
        className={fieldClasses}
        placeholder={disabled ? disabledPlaceholder : placeholder}
        value={open ? query : (selected?.title ?? "")}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[312px] overflow-y-auto rounded-lg border border-line-soft bg-surface shadow-lg"
        >
          {filtered.length === 0 && <li className="px-5 py-4 text-subtle">{emptyText}</li>}
          {filtered.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option.value);
                setQuery("");
                setOpen(false);
              }}
              className="cursor-pointer border-b border-line-soft px-5 py-3 last:border-b-0 hover:bg-page"
            >
              <div className="text-lg font-medium text-ink">{option.title}</div>
              <div className="text-[15px] text-subtle">{option.meta}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
