import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={htmlFor} className="text-base font-semibold leading-6 text-label">
        {label}
      </label>
      {children}
    </div>
  );
}
