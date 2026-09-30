import { FaUser } from "react-icons/fa6";

type CollectorInfoProps = {
  email: string;
  at: string;
};

export default function CollectorInfo({ email, at }: CollectorInfoProps) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="flex h-[2.8125rem] w-[2.8125rem] items-center justify-center overflow-hidden rounded-full bg-header-open text-muted">
        <FaUser size="1.75rem" className="mt-2" />
      </span>
      <div>
        <p className="text-xl leading-7 text-ink">{email}</p>
        <p className="text-base leading-6 text-ink">{at}</p>
      </div>
    </div>
  );
}
