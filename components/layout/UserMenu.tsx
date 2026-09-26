import Link from "next/link";
import { FaUser } from "react-icons/fa6";

type UserMenuProps = {
  name: string;
  dashboardHref: string;
};

export default function UserMenu({ name, dashboardHref }: UserMenuProps) {
  return (
    <nav className="flex items-center gap-10 pr-[2.875rem] pt-[0.3125rem] text-lg text-label">
      <Link href={dashboardHref} className="hover:text-brand">
        Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <span>{name}</span>
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-header-open text-muted">
          <FaUser size="1.75rem" className="mt-2" />
        </span>
      </div>
    </nav>
  );
}
