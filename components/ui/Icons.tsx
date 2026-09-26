import type { SVGProps } from "react";

// Inline icons — only for glyphs not available in react-icons or lucide-react.
export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.5rem"
      height="1.5rem"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden
      {...props}
    >
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" strokeWidth="2.4" />
      <path d="M3.5 9.5h17" strokeWidth="3" />
      <path d="M8 2.5v3.5M16 2.5v3.5" strokeWidth="2.4" />
      <rect x="6.8" y="12.5" width="4.4" height="4.4" rx="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
