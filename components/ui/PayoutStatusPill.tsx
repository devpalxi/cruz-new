import type { PayoutStatus } from "@/lib/admin-data";

// Blue / grey / green sampled from the reference; the rest are best-guess until seen.
const tones: Record<PayoutStatus, string> = {
  Draft: "bg-draft",
  "Awaiting Approval": "bg-info",
  "Pending Authorisation": "bg-pending",
  "Pending Payment": "bg-pending",
  "Awaiting ABA Reference": "bg-awaiting",
  "Payment Delayed": "bg-pending",
  "Payment Processing": "bg-info",
  "Payment Completed": "bg-complete",
  Rejected: "bg-danger",
  Failed: "bg-danger",
  Cancelled: "bg-danger",
};

export default function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={`inline-flex h-[1.9rem] items-center whitespace-nowrap rounded-full px-2.5 text-[0.95rem] font-semibold text-white ${tones[status]}`}
    >
      {status}
    </span>
  );
}
