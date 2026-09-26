import Link from "next/link";
import Logo from "./Logo";

export default function AppHeader() {
  return (
    <header className="flex h-[121px] shrink-0 items-start border-b border-line-soft bg-page px-5 pt-[18px]">
      <Link href="/" aria-label="Riverside Hotel home">
        <Logo className="h-[84px] w-[200px]" />
      </Link>
    </header>
  );
}
