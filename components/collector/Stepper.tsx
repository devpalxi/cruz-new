type StepperProps = {
  steps: readonly string[];
  currentIndex: number;
};

export default function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol aria-label="Payout progress">
      {steps.map((step, index) => {
        const active = index === currentIndex;
        const last = index === steps.length - 1;
        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className="relative flex h-[70px] items-start gap-[22px]"
          >
            <span
              className={`z-10 h-[30px] w-[30px] shrink-0 rounded-full border-2 bg-page ${
                active ? "border-brand" : "border-line"
              }`}
            />
            {!last && (
              <span className="absolute left-[14px] top-[30px] h-[40px] w-0.5 bg-line" />
            )}
            <span className={`text-xl leading-[30px] ${active ? "text-brand" : "text-muted"}`}>
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
