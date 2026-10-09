import RadioOption from "@/components/ui/RadioOption";
import { CHEQUE_MODES, type ChequeMode } from "@/lib/venue-data";

type ChequeModeOptionsProps = {
  value: ChequeMode | "";
  onChange: (mode: ChequeMode) => void;
};

export default function ChequeModeOptions({ value, onChange }: ChequeModeOptionsProps) {
  return (
    <div role="radiogroup" aria-label="Who enters the cheque details" className="flex flex-col gap-3">
      {CHEQUE_MODES.map((mode) => (
        <RadioOption
          key={mode.value}
          id={`cheque-mode-${mode.value}`}
          name="cheque-mode"
          checked={value === mode.value}
          onChange={() => onChange(mode.value)}
          label={mode.label}
          help={mode.help}
        />
      ))}
    </div>
  );
}
