export default function IdentityConfirmation({ lines }: { lines: string[] }) {
  return (
    <div className="mt-[0.5rem]">
      <p className="text-xl font-semibold leading-7 text-ink">Identity Confirmation:</p>
      <div className="mt-[0.5rem] rounded-md border border-line-soft bg-field px-[0.9375rem] py-2.5 text-base leading-[1.5625rem] text-label">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
