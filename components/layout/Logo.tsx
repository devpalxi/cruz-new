import Image from "next/image";

// The reference site renders the logo stretched to a fixed 200x82 box (no aspect lock); match it.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/Riverside_Hotel_Logo.png"
      alt="Riverside Hotel"
      width={200}
      height={82}
      priority
      className={`h-[5.125rem] w-[12.5rem] ${className}`}
    />
  );
}
