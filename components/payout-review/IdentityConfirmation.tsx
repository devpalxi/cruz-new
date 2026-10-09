import VerificationPill from "@/components/ui/VerificationPill";

type IdentityConfirmationProps = {
  lines: { label: string; yes: boolean }[];
};

export default function IdentityConfirmation({ lines }: IdentityConfirmationProps) {
  return (
    <div className="mt-[0.5rem]">
      <p className="text-xl font-semibold leading-7 text-ink">Identity Confirmation:</p>
      <div className="mt-[0.5rem] flex flex-col gap-2 rounded-md border border-line-soft bg-field px-[0.9375rem] py-2.5 text-base leading-[1.5625rem] text-label">
        {lines.map((line) => (
          <p key={line.label} className="flex items-center gap-2">
            {line.label}:
            <VerificationPill tone={line.yes ? "success" : "danger"}>{line.yes ? "Yes" : "No"}</VerificationPill>
          </p>
        ))}
      </div>
    </div>
  );
}
