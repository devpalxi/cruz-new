// Under the status on a cheque payout: it stays Pending Payment, and what it is still waiting for
export default function ChequePaymentNote({ waitingFor }: { waitingFor: string[] }) {
  return (
    <div className="mt-1 text-right text-base text-subtle">
      <p>
        {waitingFor.length > 0
          ? `Pending Payment. Waiting for: ${waitingFor.join(", ")}.`
          : "Pending Payment. All conditions are met."}
      </p>
      <p>Payment completes automatically. Payment Completed does not mean the winner has collected the cheque.</p>
    </div>
  );
}
