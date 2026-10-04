import { Check } from "lucide-react";
import Button from "@/components/ui/Button";

const CHECKLIST = [
  "5 mins of your time",
  "A valid email address",
  "Photo ID (Australian Driver Licence, Passport, National ID)",
  "Your bank account details",
  "You must be over 18",
];

export default function BeforeYouStartView() {
  return (
    <div>
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Before you start</h1>
      <ul className="mt-[2.5rem] flex flex-col gap-6">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-4 text-xl text-ink">
            <span className="flex h-[1.625rem] w-[1.625rem] shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <Check size="1rem" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <hr className="mt-[2.5rem] border-0 border-t-[3px] border-line-soft" />
      <Button href="/collector/email-address" className="mt-[2.5rem] h-[2.875rem] w-full">
        Get Started
      </Button>
    </div>
  );
}
