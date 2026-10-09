type SwitchProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export default function Switch({ id, checked, onChange, label }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[1.75rem] w-[3.25rem] shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus ${
        checked ? "bg-brand" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-[0.25rem] h-[1.25rem] w-[1.25rem] rounded-full bg-surface transition-all ${
          checked ? "left-[1.75rem]" : "left-[0.25rem]"
        }`}
      />
    </button>
  );
}
