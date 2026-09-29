"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DropdownProps = {
  label: string;
  items: { label: string; href: string }[];
};

export default function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="hover:text-brand"
      >
        {label}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute left-0 top-full z-30 mt-[1.1rem] min-w-[7.75rem] rounded-sm bg-surface py-1 shadow-md"
        >
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link
                role="menuitem"
                href={item.href}
                className="block px-[1.3rem] py-[0.55rem] text-lg text-ink hover:bg-page"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
