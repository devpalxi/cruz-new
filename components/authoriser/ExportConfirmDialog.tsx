import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type ExportConfirmDialogProps = {
  open: boolean;
  count: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ExportConfirmDialog({ open, count, total, onCancel, onConfirm }: ExportConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title="Export Manual Bank Transfers"
      onClose={onCancel}
      actions={
        <>
          <Button variant="outline" className="h-[2.875rem] px-6" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="h-[2.875rem] px-6" onClick={onConfirm}>
            Export
          </Button>
        </>
      }
    >
      Export <strong className="text-ink">{count} payouts</strong> (
      <strong className="text-ink">${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</strong> total)?
      <br />
      They will move to <strong className="text-ink">Awaiting ABA Reference</strong>. Enter the ABA reference once the bank has processed the file.
    </Modal>
  );
}
