import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

type StepFormLayoutProps = {
  title: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  // Back either links to another route or runs a handler (when moving between sub-screens).
  backHref?: string;
  onBack?: () => void;
};

// Heading + fields + Back/Next row shared by the Email Address and Primary ID sub-screens.
export default function StepFormLayout({
  title,
  children,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  backHref,
  onBack,
}: StepFormLayoutProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!nextDisabled) onNext();
      }}
    >
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">{title}</h1>
      <div className="flex flex-col gap-[2.125rem]">{children}</div>
      <div className="mt-[3.8125rem] flex gap-10">
        <Button variant="outline" href={backHref} onClick={onBack} className="h-[2.875rem] flex-1">
          Back
        </Button>
        <Button type="submit" disabled={nextDisabled} className="h-[2.875rem] flex-1">
          {nextLabel}
        </Button>
      </div>
    </form>
  );
}
