import type { TextareaHTMLAttributes } from "react";

export default function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus ${className}`}
      {...props}
    />
  );
}
