import { Check, TriangleAlert, X } from "lucide-react";

type AlertTone = "warning" | "success" | "danger";

type WarningAlertProps = {
  message?: string;
  title?: string;
  tone?: AlertTone;
};

const toneStyles: Record<AlertTone, { border: string; bg: string; text: string; Icon: typeof TriangleAlert }> = {
  warning: { border: "border-warn-line", bg: "bg-warn-bg", text: "text-warn-ink", Icon: TriangleAlert },
  success: { border: "border-[#4daa9e80]", bg: "bg-[#4daa9e1a]", text: "text-[#2b2e33]", Icon: Check },
  danger: { border: "border-danger-line", bg: "bg-danger-bg", text: "text-red-700", Icon: X },
};

export default function WarningAlert({ title, message, tone = "warning" }: WarningAlertProps) {
  const { border, bg, text, Icon } = toneStyles[tone];
  return (
    <div className={`rounded-md border ${border} ${bg} px-4 py-[0.9375rem]`}>
      {title ? (
        <>
          <p className={`flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-[1.375rem] ${text}`}>
            <Icon size="1rem" strokeWidth={1.75} />
            {title}
          </p>
          {message && <p className="mt-1 text-[0.9375rem] leading-5 text-label">{message}</p>}
        </>
      ) : (
        <p className={`flex items-center gap-1.5 text-[0.9375rem] leading-5 ${text}`}>
          <Icon size="1rem" strokeWidth={1.75} />
          {message}
        </p>
      )}
    </div>
  );
}
