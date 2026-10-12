type SwitchProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  // Id of the text that explains what the switch does, so screen readers read it with the switch
  describedBy?: string;
};

// A real button with role="switch", so Space and Enter work. The state is shown in words as well as colour.
export default function Switch({ id, checked, onChange, label, describedBy }: SwitchProps) {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <span aria-hidden="true" className={`w-[1.75rem] text-right text-base font-medium ${checked ? "text-ink" : "text-subtle"}`}>
        {checked ? "On" : "Off"}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={describedBy}
        onClick={() => onChange(!checked)}
        className={`relative h-[1.75rem] w-[3.25rem] shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${
          checked ? "bg-brand" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-[0.25rem] h-[1.25rem] w-[1.25rem] rounded-full bg-surface transition-all ${
            checked ? "left-[1.75rem]" : "left-[0.25rem]"
          }`}
        />
      </button>
    </span>
  );
}
