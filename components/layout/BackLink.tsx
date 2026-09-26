import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: string;
};

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="-ml-2 inline-flex items-center gap-1.5 text-[1.4375rem] text-label hover:text-brand"
    >
      <ArrowLeft size="2.25rem" strokeWidth={1.75} className="text-line" />
      {children}
    </Link>
  );
}
