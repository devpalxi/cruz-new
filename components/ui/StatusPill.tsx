import type { ReactNode } from "react";

type Tone = "info" | "success" | "successStrong" | "warning" | "danger";

const tones: Record<Tone, string> = {
  info: "bg-info text-white",
  success: "border border-[#4daa9e80] bg-[#4daa9e1a] text-[#2b2e33]",
  successStrong: "bg-success-pill text-success-ink",
  warning: "border border-warn-line bg-warn-bg text-warn-ink",
  danger: "border border-danger-line bg-danger-bg text-red-700",
};

type StatusPillProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export default function StatusPill({ tone = "info", className = "", children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 text-base font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
