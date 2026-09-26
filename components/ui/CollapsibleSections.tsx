"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import Button from "./Button";

export type SectionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

// Multi-open list of sections, all expanded by default, with a Collapse All / Expand All toggle.
export default function CollapsibleSections({ items }: { items: SectionItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(items.map((i) => i.id)));
  const allOpen = openIds.size === items.length;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="soft"
          className="h-[2.3125rem] gap-2 px-[0.9375rem] text-[0.9375rem]! font-medium!"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(items.map((i) => i.id)))}
        >
          {allOpen ? "Collapse All" : "Expand All"}
          <span className="text-[0.625rem]">{allOpen ? "▲" : "▼"}</span>
        </Button>
      </div>

      <div className="mt-[1.5rem]">
        {items.map((item, index) => {
          const open = openIds.has(item.id);
          const Chevron = open ? ChevronUp : ChevronDown;
          return (
            <div
              key={item.id}
              className={`border-x border-line-soft ${
                index === 0 ? "rounded-t-xl border-t" : ""
              } ${index === items.length - 1 ? "rounded-b-xl border-b" : ""} ${
                index > 0 ? "border-t" : ""
              }`}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggle(item.id)}
                className={`flex h-[5.0625rem] w-full items-center justify-between px-[1.625rem] text-left text-xl ${
                  open ? "border-b border-line-soft text-ink" : "text-label"
                }`}
              >
                {item.title}
                <Chevron size="1.625rem" strokeWidth={3} className="text-ink" />
              </button>
              {open && <div className="px-[1.625rem] pb-[1.4375rem] pt-[1.5625rem]">{item.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
