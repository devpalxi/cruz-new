import { Check } from "lucide-react";
import Link from "next/link";
import type { CollectorStep } from "@/lib/collector-data";

type StepperProps = {
  steps: CollectorStep[];
  currentIndex: number;
};

export default function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol aria-label="Payout progress">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const last = index === steps.length - 1;
        return (
          <li key={step.href} className="relative h-[4.375rem]">
            <Link
              href={step.href}
              aria-current={active ? "step" : undefined}
              className="group flex items-start gap-[1.375rem]"
            >
              <span
                className={`z-10 flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  done
                    ? "border-brand bg-brand text-white"
                    : active
                      ? "border-brand bg-page"
                      : "border-line bg-page group-hover:border-brand"
                }`}
              >
                {done && <Check size="1rem" strokeWidth={2} />}
              </span>
              <span
                className={`text-xl leading-[1.875rem] transition-colors ${
                  done || active ? "text-brand" : "text-muted group-hover:text-brand"
                }`}
              >
                {step.label}
              </span>
            </Link>
            {!last && (
              <span
                className={`absolute left-[0.875rem] top-[1.875rem] h-[2.5rem] w-0.5 ${
                  done ? "bg-brand" : "bg-line"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
