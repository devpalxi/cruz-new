import type { ReactNode } from "react";

type Tone = "info" | "success" | "successStrong";

const tones: Record<Tone, string> = {
  info: "bg-info text-white",
  success: "border border-success-line bg-success-soft text-success",
  successStrong: "bg-success-pill text-success-ink",
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
