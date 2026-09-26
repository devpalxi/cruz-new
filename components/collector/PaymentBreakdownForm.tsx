"use client";

import { useState } from "react";
import { FaBuildingColumns, FaMoneyBill } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import CurrencyInput from "@/components/ui/CurrencyInput";
import FormField from "@/components/ui/FormField";
import { MOCK_TOTAL_WINNINGS } from "@/lib/collector-data";
import AmountCard from "./AmountCard";

export default function PaymentBreakdownForm() {
  const [cash, setCash] = useState(String(MOCK_TOTAL_WINNINGS));
  const [confirmCash, setConfirmCash] = useState("");
  const [bank, setBank] = useState("0");

  const canContinue =
    Number(cash) > 0 &&
    confirmCash === cash &&
    Number(cash) + Number(bank) === MOCK_TOTAL_WINNINGS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // next step (Email Address) not built yet
      }}
    >
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        Payout Details
      </h1>

      <FormField label="Total Winnings">
        <CurrencyInput value={MOCK_TOTAL_WINNINGS} disabled readOnly />
      </FormField>

      <hr className="mt-[1.875rem] border-0 border-t-[3px] border-line-soft" />

      <div className="mt-[2.625rem] flex flex-col gap-[2.625rem]">
        <AmountCard icon={<FaMoneyBill size="2.2rem" />} title="Cash Amount">
          <CurrencyInput
            aria-label="Cash Amount"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
          />
          <div className="mt-[0.875rem]">
            <FormField label="Confirm Cash Amount" htmlFor="confirm-cash">
              <CurrencyInput
                id="confirm-cash"
                value={confirmCash}
                onChange={(e) => setConfirmCash(e.target.value)}
              />
            </FormField>
          </div>
        </AmountCard>

        <AmountCard icon={<FaBuildingColumns size="2.2rem" />} title="Bank Transfer">
          <CurrencyInput
            aria-label="Bank Transfer"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          />
        </AmountCard>
      </div>

      <Button type="submit" disabled={!canContinue} className="mt-[3.8125rem] h-[2.875rem] w-full">
        Next
      </Button>
    </form>
  );
}
