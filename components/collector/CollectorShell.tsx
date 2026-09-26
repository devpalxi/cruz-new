import Link from "next/link";
import type { ReactNode } from "react";
import { COLLECTOR_STEPS } from "@/lib/collector-data";
import AppHeader from "@/components/layout/AppHeader";
import { CloseIcon } from "@/components/ui/Icons";
import Stepper from "./Stepper";

type CollectorShellProps = {
  currentStep: number;
  children: ReactNode;
};

export default function CollectorShell({ currentStep, children }: CollectorShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader />
      <div className="relative grid flex-1 grid-cols-1 px-4 pb-16 pt-[90px] sm:px-8 lg:grid-cols-[400px_minmax(0,613px)] lg:justify-center lg:px-0 wide:grid-cols-[1fr_613px_1fr] wide:justify-normal">
        <aside className="hidden lg:block lg:pl-20">
          <Stepper steps={COLLECTOR_STEPS} currentIndex={currentStep} />
        </aside>
        <main className="mx-auto w-full max-w-[613px]">{children}</main>
        <Link
          href="/"
          aria-label="Close and return home"
          className="absolute right-6 top-[34px] rounded p-1 text-ink hover:bg-surface sm:right-12"
        >
          <CloseIcon />
        </Link>
      </div>
    </div>
  );
}
