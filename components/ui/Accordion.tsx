"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

// Single-open accordion: opening one section closes the others.
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-line-soft bg-page">
      {items.map((item, index) => {
        const open = item.id === openId;
        const Chevron = open ? ChevronUp : ChevronDown;
        return (
          <div key={item.id} className={index > 0 ? "border-t border-line-soft" : ""}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className={`flex h-[5rem] w-full items-center justify-between px-[1.625rem] text-left text-xl ${
                open
                  ? "relative z-10 rounded-md bg-header-open text-ink ring-[0.1875rem] ring-line-soft"
                  : "text-label"
              }`}
            >
              {item.title}
              <Chevron size="1.25rem" strokeWidth={3} className="text-ink" />
            </button>
            {open && <div className="px-[1.625rem] pb-[1.625rem] pt-[1.4375rem]">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
