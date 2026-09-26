import Link from "next/link";
import Logo from "./Logo";

export default function AppHeader() {
  return (
    <header className="flex h-[121px] shrink-0 items-start border-b border-line-soft bg-page px-5 pt-[19px]">
      <Link href="/" aria-label="Riverside Hotel home">
        <Logo />
      </Link>
    </header>
  );
}
