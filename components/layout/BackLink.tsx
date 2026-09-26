import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: string;
};

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 text-[1.375rem] text-subtle hover:text-brand">
      <ArrowLeft size="1.75rem" strokeWidth={1.5} className="text-line" />
      {children}
    </Link>
  );
}
