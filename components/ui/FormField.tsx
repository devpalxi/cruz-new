import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  // Adds an asterisk after the label for a field that must be filled in
  required?: boolean;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, required = false, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={htmlFor} className="text-base font-semibold leading-6 text-label">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
