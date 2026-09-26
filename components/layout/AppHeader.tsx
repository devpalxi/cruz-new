import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "./Logo";

type AppHeaderProps = {
  right?: ReactNode;
};

export default function AppHeader({ right }: AppHeaderProps) {
  return (
    <header className="flex h-[7.5625rem] shrink-0 items-start justify-between border-b border-line-soft bg-page px-5 pt-[1.1875rem]">
      <Link href="/" aria-label="Riverside Hotel home">
        <Logo />
      </Link>
      {right}
    </header>
  );
}
