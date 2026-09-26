import Button from "@/components/ui/Button";

export default function DocketRow() {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div>
        <p className="text-xl font-medium leading-7 text-ink">Payout Docket</p>
        <p className="text-[1.0625rem] leading-7 text-subtle">Submitted docket image from collector</p>
      </div>
      <Button
        variant="ghost"
        className="relative -top-[0.125rem] h-[2.875rem] rounded-lg! px-[1.6rem] text-lg! font-normal!"
      >
        View Docket
      </Button>
    </div>
  );
}
