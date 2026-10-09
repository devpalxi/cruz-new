type RadioOptionProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  help: string;
};

export default function RadioOption({ id, name, checked, onChange, label, help }: RadioOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-field px-[1.3125rem] py-4 ${
        checked ? "border-brand" : "border-line"
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 cursor-pointer accent-brand"
      />
      <span>
        <span className="block text-lg font-medium text-ink">{label}</span>
        <span className="mt-0.5 block text-base text-subtle">{help}</span>
      </span>
    </label>
  );
}
