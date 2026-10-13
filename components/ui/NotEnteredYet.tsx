import StatusPill from "@/components/ui/StatusPill";

// A value nobody has entered yet, shown in the warning tone so it is noticed
export default function NotEnteredYet() {
  return (
    <StatusPill tone="warning" className="h-6 px-2 text-[0.875rem] font-medium">
      Not entered yet
    </StatusPill>
  );
}
