import { Check, TriangleAlert, X } from "lucide-react";
import StatusPill from "./StatusPill";

export type VerificationTone = "success" | "warning" | "danger";

type VerificationPillProps = {
  tone: VerificationTone;
  children: string;
  // "sm" for inline rows on the review panels; "md" for a standalone result card.
  size?: "sm" | "md";
};

const ICONS = { success: Check, warning: TriangleAlert, danger: X };

const SIZES = {
  sm: { pill: "h-6 px-2 text-[0.875rem] font-medium", icon: "0.875rem", stroke: 2 },
  md: { pill: "h-[1.9375rem] px-4 text-sm", icon: "1rem", stroke: 1.75 },
};

// The one way a verification outcome (CoP Status, ID Name Match, ...) is shown: a toned pill with an
// icon and the result text. Never render these as plain coloured text — see docs/design.md.
export default function VerificationPill({ tone, children, size = "sm" }: VerificationPillProps) {
  const Icon = ICONS[tone];
  const { pill, icon, stroke } = SIZES[size];
  return (
    <StatusPill tone={tone} className={pill}>
      <Icon size={icon} strokeWidth={stroke} />
      {children}
    </StatusPill>
  );
}
