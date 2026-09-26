import Link from "next/link";
import type { ReactNode } from "react";
import { COLLECTOR_STEPS } from "@/lib/collector-data";
import AppHeader from "@/components/layout/AppHeader";
import { X } from "lucide-react";
import Stepper from "./Stepper";

type CollectorShellProps = {
  currentStep: number;
  children: ReactNode;
};

export default function CollectorShell({ currentStep, children }: CollectorShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <div className="relative grid flex-1 grid-cols-1 px-4 pb-16 pt-[5.625rem] sm:px-8 lg:grid-cols-[25rem_minmax(0,38.3125rem)] lg:justify-center lg:px-0 wide:grid-cols-[1fr_38.3125rem_1fr] wide:justify-normal">
        <aside className="hidden lg:block lg:pl-20">
          <Stepper steps={COLLECTOR_STEPS} currentIndex={currentStep} />
        </aside>
        <main className="mx-auto w-full max-w-[38.3125rem]">{children}</main>
        <Link
          href="/"
          aria-label="Close and return home"
          className="absolute right-6 top-[2.125rem] rounded p-1 text-ink hover:bg-surface sm:right-12"
        >
          <X size="1.5rem" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
