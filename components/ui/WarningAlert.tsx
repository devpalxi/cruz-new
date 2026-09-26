import { TriangleAlert } from "lucide-react";

type WarningAlertProps = {
  title: string;
  message: string;
};

export default function WarningAlert({ title, message }: WarningAlertProps) {
  return (
    <div className="rounded-md border border-warn-line bg-warn-bg px-4 py-[0.9375rem]">
      <p className="flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-[1.375rem] text-warn-ink">
        <TriangleAlert size="1rem" strokeWidth={1.75} />
        {title}
      </p>
      <p className="mt-1 text-[0.9375rem] leading-5 text-label">{message}</p>
    </div>
  );
}
