"use client";

import { CircleCheck, X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-8 right-8 z-50 flex max-w-[30rem] items-start gap-3 rounded-lg border border-success-line bg-surface px-5 py-4 text-lg text-ink shadow-lg"
    >
      <CircleCheck size="1.5rem" className="mt-0.5 shrink-0 text-success" />
      <span className="flex-1">{message}</span>
      <button type="button" aria-label="Dismiss" onClick={onClose} className="text-muted hover:text-ink">
        <X size="1.25rem" />
      </button>
    </div>
  );
}
