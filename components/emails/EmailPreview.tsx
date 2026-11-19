import type { ReactNode } from "react";

type EmailPreviewProps = {
  title: string;
  from: string;
  to: string;
  subject: string;
  children: ReactNode;
};

// A plain mock of an email as the recipient would see it: sender, recipient and subject above the body
export default function EmailPreview({ title, from, to, subject, children }: EmailPreviewProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <dl className="flex flex-col gap-1 border-b border-line-soft bg-card px-6 py-4 text-base">
          <div className="flex gap-2">
            <dt className="w-[4.5rem] font-semibold text-label">From:</dt>
            <dd className="text-ink">{from}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-[4.5rem] font-semibold text-label">To:</dt>
            <dd className="text-ink">{to}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-[4.5rem] font-semibold text-label">Subject:</dt>
            <dd className="font-semibold text-ink">{subject}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-4 px-6 py-6 text-lg leading-7 text-ink">{children}</div>
      </div>
    </section>
  );
}
