import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "soft" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:opacity-100",
  outline: "border border-line bg-page text-ink hover:bg-surface",
  ghost: "border border-line-soft bg-surface text-ink hover:border-line",
  soft: "border border-success-line bg-success-soft text-success hover:border-success",
  danger: "bg-danger text-white hover:opacity-90",
};

const base =
  "inline-flex items-center justify-center rounded-md text-base font-semibold transition-colors";

export default function Button({
  variant = "primary",
  href,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
