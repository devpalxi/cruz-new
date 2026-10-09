"use client";

import { useEffect, useState } from "react";
import { FaBuildingColumns, FaMoneyBillTransfer, FaMoneyCheckDollar } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import WarningAlert from "@/components/ui/WarningAlert";
import {
  RETURNED_PAYOUT,
  RETURNED_PAYOUT_KEY,
  type ReturnedPayoutType,
} from "@/lib/payout-review-scenarios";
import { CHEQUE_LABEL, FUNDS_TRANSFER_LABEL, PAYMENT_FILE_LABEL } from "@/lib/venue-data";
import AmountCard from "./AmountCard";
import BankAccountFields from "./BankAccountFields";
import ChequeDetailsFields from "./ChequeDetailsFields";

const CARDS = {
  "funds-transfer": { title: FUNDS_TRANSFER_LABEL, icon: <FaBuildingColumns size="2.2rem" /> },
  "payment-file": { title: PAYMENT_FILE_LABEL, icon: <FaMoneyBillTransfer size="2.2rem" /> },
  cheque: { title: CHEQUE_LABEL, icon: <FaMoneyCheckDollar size="2.2rem" /> },
};

// The Collector corrects details that an Approver or Authoriser sent back, then sends the payout for review again.
export default function ReturnedPayoutView({ type }: { type: ReturnedPayoutType }) {
  const isCheque = type === "cheque";
  const [chequeNumber, setChequeNumber] = useState(RETURNED_PAYOUT.cheque.number);
  const [chequeName, setChequeName] = useState(RETURNED_PAYOUT.cheque.name);
  const [accountName, setAccountName] = useState(RETURNED_PAYOUT.account.name);
  const [bsb, setBsb] = useState(RETURNED_PAYOUT.account.bsb);
  const [accountNumber, setAccountNumber] = useState(RETURNED_PAYOUT.account.number);
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Who returned it and why: the reviewer's own message when they just returned it, otherwise a sample
  const [returnInfo, setReturnInfo] = useState({
    returnedBy: RETURNED_PAYOUT.returnedBy,
    returnedAt: RETURNED_PAYOUT.returnedAt,
    reason: RETURNED_PAYOUT.reasons[type],
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(RETURNED_PAYOUT_KEY);
      if (saved) setReturnInfo(JSON.parse(saved));
    } catch {
      // Keep the sample reason
    }
  }, []);

  const chequeErrors = {
    chequeNumber: chequeNumber.trim() === "" ? "Enter the cheque number." : undefined,
    chequeName: chequeName.trim() === "" ? "Enter the name on the cheque." : undefined,
  };
  const bankErrors = {
    accountName: accountName.trim() === "" ? "Enter the account name." : undefined,
    bsb: /^\d{3}-?\d{3}$/.test(bsb.trim()) ? undefined : "Enter a 6-digit BSB, for example 032-001.",
    accountNumber: accountNumber.trim() === "" ? "Enter the account number." : undefined,
  };
  const hasErrors = Object.values(isCheque ? chequeErrors : bankErrors).some(Boolean);

  function handleResubmit() {
    if (hasErrors) {
      setShowErrors(true);
      return;
    }
    setSent(true);
    setToast(`Payout #${RETURNED_PAYOUT.payoutId} was sent back for review.`);
  }

  return (
    <div>
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">Correct Returned Payout</h1>

      <WarningAlert
        title={`Payout #${RETURNED_PAYOUT.payoutId} was returned by ${returnInfo.returnedBy}`}
        message={returnInfo.reason}
      />
      <p className="mt-2 text-base text-subtle">Returned {returnInfo.returnedAt}</p>

      <div className="mt-[2.625rem]">
        <AmountCard icon={CARDS[type].icon} title={CARDS[type].title}>
          {isCheque ? (
            <ChequeDetailsFields
              mode="collector"
              chequeNumber={chequeNumber}
              onChequeNumberChange={setChequeNumber}
              chequeName={chequeName}
              onChequeNameChange={setChequeName}
              errors={showErrors ? chequeErrors : {}}
            />
          ) : (
            <BankAccountFields
              accountName={accountName}
              onAccountNameChange={setAccountName}
              bsb={bsb}
              onBsbChange={setBsb}
              accountNumber={accountNumber}
              onAccountNumberChange={setAccountNumber}
              errors={showErrors ? bankErrors : {}}
            />
          )}
        </AmountCard>
      </div>

      <p className="mt-6 text-base text-subtle">
        Correcting the details does not pay the payout. It goes back for review first.
      </p>

      <Button disabled={sent} onClick={handleResubmit} className="mt-[2rem] h-[2.875rem] w-full">
        Send Back for Review
      </Button>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
