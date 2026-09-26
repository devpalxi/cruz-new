import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth="2" {...props}>
      <rect x="4" y="4.5" width="16" height="16" rx="2.5" fill="currentColor" stroke="none" />
      <path d="M8 2.5v3.5M16 2.5v3.5" strokeWidth="2.4" />
      <rect x="6.5" y="9.5" width="5" height="4.5" rx="0.6" fill="#fff" stroke="none" />
    </svg>
  );
}

export function CloudUploadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" {...base} strokeWidth="3" {...props}>
      <path d="M15 34.5H13a8 8 0 0 1-1.6-15.84A11 11 0 0 1 33 15.5a9 9 0 0 1 2 17.8" />
      <path d="M24 42V24M17.5 30.5 24 24l6.5 6.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} strokeWidth="3" {...props}>
      <path d="m5 9 7 7 7-7" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth="2" {...props}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}
