import { notFound } from "next/navigation";
import CollectorShell from "@/components/collector/CollectorShell";
import { COLLECTOR_STEPS } from "@/lib/collector-data";

// Placeholder for collector steps that have no dedicated page yet.
// Built steps have their own static route, which takes precedence over this one.
export default async function CollectorStepPlaceholder({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const index = COLLECTOR_STEPS.findIndex((s) => s.href === `/collector/${step}`);
  if (index === -1) notFound();

  return (
    <CollectorShell currentStep={index}>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        {COLLECTOR_STEPS[index].label}
      </h1>
      <p className="mt-6 text-xl text-subtle">This step hasn&apos;t been built yet.</p>
    </CollectorShell>
  );
}
