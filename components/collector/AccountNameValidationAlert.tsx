"use client";

import { Check, TriangleAlert, X } from "lucide-react";
import { useState } from "react";

type Tone = "success" | "warning" | "danger";

type AccountNameValidationAlertProps = {
  tone: Tone;
  title: string;
  messages?: string[];
  // Close Match / No Match let the collector override and proceed with a note.
  showActions?: boolean;
  confirmLabel?: string;
  notesPlaceholder?: string;
  notesValue?: string;
};

const TONE_STYLES: Record<Tone, { border: string; bg: string; text: string; Icon: typeof TriangleAlert }> = {
  success: { border: "border-[#4daa9e80]", bg: "bg-[#4daa9e1a]", text: "text-[#2b2e33]", Icon: Check },
  warning: { border: "border-warn-line", bg: "bg-warn-bg", text: "text-warn-ink", Icon: TriangleAlert },
  danger: { border: "border-danger-line", bg: "bg-danger-bg", text: "text-red-700", Icon: X },
};

export default function AccountNameValidationAlert({
  tone,
  title,
  messages = [],
  showActions = false,
  confirmLabel,
  notesPlaceholder,
  notesValue = "",
}: AccountNameValidationAlertProps) {
  const [confirmed, setConfirmed] = useState(showActions);
  const [notes, setNotes] = useState(notesValue);
  const { border, bg, text, Icon } = TONE_STYLES[tone];

  return (
    <div className={`rounded-md border ${border} ${bg} px-4 py-[0.9375rem]`}>
      <p className={`flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-[1.375rem] ${text}`}>
        <Icon size="1rem" strokeWidth={1.75} />
        {title}
      </p>
      {messages.map((message) => (
        <p key={message} className="mt-1 text-[0.9375rem] leading-5 text-label">
          {message}
        </p>
      ))}

      {showActions && (
        <>
          <button
            type="button"
            className={`mt-3 w-full rounded-md border ${border} bg-surface px-4 py-2.5 text-base font-semibold ${text}`}
          >
            Edit Bank Details
          </button>
          <label className={`mt-3 flex cursor-pointer items-start gap-2 text-[0.9375rem] font-medium ${text}`}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-[1.125rem] w-[1.125rem] cursor-pointer accent-brand"
            />
            {confirmLabel}
          </label>
          <label className="mt-3 block text-[0.9375rem] text-label">
            Notes (Optional)
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={notesPlaceholder}
              className="mt-1 w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
            />
          </label>
        </>
      )}
    </div>
  );
}
