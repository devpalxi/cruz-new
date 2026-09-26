import Button from "@/components/ui/Button";

export default function DocketRow() {
  return (
    <div className="mt-[0.9375rem] flex items-center justify-between">
      <div>
        <p className="text-xl leading-7 text-ink">Payout Docket</p>
        <p className="text-lg leading-7 text-subtle">Submitted docket image from collector</p>
      </div>
      <Button variant="ghost" className="h-[2.875rem] px-[1.625rem] text-base font-medium">
        View Docket
      </Button>
    </div>
  );
}
