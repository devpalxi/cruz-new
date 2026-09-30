"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({ title, onClose, children, footer }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div className="w-full max-w-[37.5rem] rounded-xl bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-5">
          <h2 className="text-2xl font-bold text-ink">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-subtle hover:bg-page"
          >
            <X size="1.5rem" strokeWidth={2} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer && <div className="flex justify-end gap-4 border-t border-line-soft px-6 py-5">{footer}</div>}
      </div>
    </div>
  );
}
