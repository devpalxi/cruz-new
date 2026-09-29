"use client";

import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions: ReactNode;
};

export default function Modal({ open, title, onClose, children, actions }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-[34rem] rounded-xl bg-surface p-7 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-semibold text-title-navy">
          {title}
        </h2>
        <div className="mt-3 text-lg leading-7 text-label">{children}</div>
        <div className="mt-7 flex justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
}
