"use client";

import { useRef, useState } from "react";
import Button from "./Button";
import { CloudUploadIcon } from "./Icons";

type FileDropzoneProps = {
  prompt: string;
  accept?: string;
  onFile?: (file: File) => void;
};

export default function FileDropzone({ prompt, accept = "image/*", onFile }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    onFile?.(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`flex h-60 flex-col items-center justify-center gap-4 rounded-lg border border-dotted bg-surface px-4 text-center ${
        dragging ? "border-focus" : "border-line"
      }`}
    >
      <CloudUploadIcon className="text-subtle" />
      <p className="mt-2 text-lg text-ink">{fileName ?? prompt}</p>
      <Button variant="ghost" className="h-[52px] px-6" onClick={() => inputRef.current?.click()}>
        Browse
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
