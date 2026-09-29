import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export default function SearchInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={`flex h-[3.1rem] items-center gap-2.5 rounded-md border border-line bg-surface px-4 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus ${className}`}
    >
      <Search size="1.35rem" strokeWidth={1.75} className="shrink-0 text-muted" />
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
        {...props}
      />
    </div>
  );
}
