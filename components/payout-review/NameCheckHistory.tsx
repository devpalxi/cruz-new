import StatusPill from "@/components/ui/StatusPill";
import { NAME_SOURCE_LABELS, type NameCheckRecord } from "@/lib/name-match";

// Earlier decisions about a cheque name difference on this payout, read-only and marked Historical.
// Shown the same way to the Approver and the Authoriser.
export default function NameCheckHistory({ records }: { records: NameCheckRecord[] }) {
  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => (
        <div key={record.id} className="rounded-xl border border-line-soft bg-field px-[1.25rem] py-[1.25rem]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-base font-semibold text-ink">
              {record.recordedAt}, {record.authoriser} (Authoriser)
            </p>
            <StatusPill tone="info" className="h-6 px-2 text-[0.875rem] font-medium">
              Historical
            </StatusPill>
          </div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-base text-ink">
            <dt className="font-medium">Cheque Name:</dt>
            <dd>{record.chequeName}</dd>
            <dt className="font-medium">{NAME_SOURCE_LABELS[record.source]}:</dt>
            <dd>{record.comparedName}</dd>
            <dt className="font-medium">Rationale:</dt>
            <dd className="break-words">{record.rationale}</dd>
            <dt className="font-medium">Acknowledged:</dt>
            <dd>{record.acknowledged ? "Yes" : "No"}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}
