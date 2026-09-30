import { Check, TriangleAlert, X } from "lucide-react";
import StatusPill from "@/components/ui/StatusPill";
import WarningAlert from "@/components/ui/WarningAlert";

type CopValidationCardProps = {
  status: string;
  headline?: string;
  message?: string;
  // Only Bank Transfer runs a real Zepto CoP check — other destinations use this for their
  // client-side name comparison instead.
  title?: string;
};

const STATUS_TONE: Record<string, "success" | "warning" | "danger"> = {
  Match: "success",
  "Close Match": "warning",
  "No Match": "danger",
};

const STATUS_ICON = { success: Check, warning: TriangleAlert, danger: X };

export default function CopValidationCard({ status, headline, message, title = "CoP Validation" }: CopValidationCardProps) {
  const tone = STATUS_TONE[status] ?? "warning";
  const Icon = STATUS_ICON[tone];

  return (
    <section className="rounded-xl border border-line-soft bg-page px-[1.3125rem] pb-[1.1875rem] pt-[1.375rem]">
      <h2 className="text-xl font-semibold leading-7 text-ink">{title}</h2>
      <div className="mt-[0.6875rem]">
        <StatusPill tone={tone} className="h-[1.9375rem] px-4 text-sm">
          <Icon size="1rem" strokeWidth={1.75} />
          {status}
        </StatusPill>
      </div>
      {/* Only an ambiguous "Close Match" needs an explanation — a clean Match or a clear No Match don't. */}
      {tone === "warning" && headline && message && (
        <div className="mt-3">
          <WarningAlert title={headline} message={message} />
        </div>
      )}
    </section>
  );
}
