import Link from "next/link";
import { FaUser } from "react-icons/fa6";

type UserMenuProps = {
  name: string;
  dashboardHref: string;
};

export default function UserMenu({ name, dashboardHref }: UserMenuProps) {
  return (
    <nav className="flex items-center gap-10 pr-[2.875rem] pt-[1.3125rem] text-lg text-ink">
      <Link href={dashboardHref} className="hover:text-brand">
        Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <span>{name}</span>
        <span className="flex h-[3.125rem] w-[3.125rem] items-center justify-center overflow-hidden rounded-full bg-header-open text-muted">
          <FaUser size="2.125rem" className="mt-2.5" />
        </span>
      </div>
    </nav>
  );
}
