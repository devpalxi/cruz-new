import Button from "@/components/ui/Button";

type IdCheckActionRowProps = {
  onBack: () => void;
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export default function IdCheckActionRow({ onBack, label, disabled, onClick }: IdCheckActionRowProps) {
  return (
    <div className="mt-[1.5rem] flex gap-10">
      <Button variant="outline" onClick={onBack} className="h-[2.875rem] flex-1">
        Back
      </Button>
      <Button disabled={disabled} onClick={onClick} className="h-[2.875rem] flex-1">
        {label}
      </Button>
    </div>
  );
}
