import { Check, Clock } from "lucide-react";
import StatusPill from "@/components/ui/StatusPill";
import type { PaymentCondition } from "@/lib/cheque-payment-status";

// Where a cheque payout stands: Pending Payment, and what is still needed before it completes by itself.
export default function ChequePaymentStatus({ conditions }: { conditions: PaymentCondition[] }) {
  const allMet = conditions.every((condition) => condition.done);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xl text-ink">
        Status:
        <StatusPill tone="info" className="h-[1.875rem] px-2.5! text-[0.9375rem]!">
          Pending Payment
        </StatusPill>
      </div>
      <p className="text-base text-label">
        {allMet
          ? "All conditions are met. Payment completes automatically."
          : "Payment completes automatically when these are done."}
      </p>
      <ul className="flex flex-col gap-2">
        {conditions.map((condition) => {
          const Icon = condition.done ? Check : Clock;
          return (
            <li key={condition.label} className="flex items-start gap-2 text-base text-ink">
              <Icon
                size="1.125rem"
                strokeWidth={2}
                aria-hidden="true"
                className={`mt-0.5 shrink-0 ${condition.done ? "text-success-ink" : "text-warn-ink"}`}
              />
              <span>
                <span className="font-medium">{condition.label}</span>
                <span className="text-subtle"> {condition.done ? "Done" : "Outstanding"}</span>
                {condition.detail && <span className="block text-subtle">{condition.detail}</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-base text-subtle">Payment Completed does not mean the winner has collected the cheque.</p>
    </div>
  );
}
