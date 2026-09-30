"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { FaBuildingColumns, FaIdCard, FaMoneyBill, FaMoneyBillTransfer, FaMoneyCheckDollar } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import CurrencyInput from "@/components/ui/CurrencyInput";
import FormField from "@/components/ui/FormField";
import SelectInput from "@/components/ui/SelectInput";
import {
  MOCK_TOTAL_WINNINGS,
  PAYOUT_DESTINATION_DETAILS_KEY,
  PAYOUT_DESTINATIONS,
  SELECTED_DESTINATION_KEY,
  type PayoutDestinationType,
} from "@/lib/collector-data";
import AmountCard from "./AmountCard";

const DESTINATION_ICONS: Record<PayoutDestinationType, ReactNode> = {
  bank: <FaBuildingColumns size="2.2rem" />,
  "manual-bank": <FaMoneyBillTransfer size="2.2rem" />,
  cheque: <FaMoneyCheckDollar size="2.2rem" />,
  "membership-card": <FaIdCard size="2.2rem" />,
};

const DESTINATION_OPTIONS = PAYOUT_DESTINATIONS.map((destination) => ({
  value: destination.type,
  label: destination.label,
}));

export default function PaymentBreakdownForm() {
  const router = useRouter();
  const [cash, setCash] = useState("");
  const [confirmCash, setConfirmCash] = useState("");
  const [destinationType, setDestinationType] = useState<PayoutDestinationType | "">("");
  const [destinationAmount, setDestinationAmount] = useState("0");

  const selectedDestination = PAYOUT_DESTINATIONS.find((d) => d.type === destinationType);
  const cashMismatch = confirmCash !== "" && confirmCash !== cash;
  const cashConfirmed = cash !== "" && confirmCash === cash;

  const canContinue =
    Number(cash) > 0 &&
    confirmCash === cash &&
    Number(cash) + (destinationType === "" ? 0 : Number(destinationAmount) || 0) === MOCK_TOTAL_WINNINGS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (destinationType === "") {
          // Cash-only payout: no destination details to capture; clear any stale selection
          // left over from switching back from a non-cash destination.
          sessionStorage.removeItem(SELECTED_DESTINATION_KEY);
          sessionStorage.removeItem(PAYOUT_DESTINATION_DETAILS_KEY);
          router.push("/collector/summary");
          return;
        }
        sessionStorage.setItem(SELECTED_DESTINATION_KEY, JSON.stringify(destinationType));
        // Steps 3-5 are skipped for now; jump straight to Payout Destination Details
        router.push("/collector/payout-destination-details");
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
            {cashMismatch && <p className="mt-2 text-[1.25rem] text-danger">Cash amounts do not match.</p>}
          </div>
        </AmountCard>

        <FormField label="Non-Cash Destination" htmlFor="destination-type">
          <SelectInput
            id="destination-type"
            options={DESTINATION_OPTIONS}
            value={destinationType}
            onChange={(e) => {
              const type = e.target.value as PayoutDestinationType | "";
              setDestinationType(type);
              // Once the cash amount is confirmed, auto-fill the non-cash amount with the
              // remainder of the total winnings instead of always resetting to 0.
              setDestinationAmount(
                type !== "" && cashConfirmed ? String(MOCK_TOTAL_WINNINGS - Number(cash)) : "0",
              );
            }}
          />
        </FormField>

        {selectedDestination && (
          <AmountCard icon={DESTINATION_ICONS[selectedDestination.type]} title={selectedDestination.label}>
            <CurrencyInput
              aria-label={selectedDestination.label}
              value={destinationAmount}
              onChange={(e) => setDestinationAmount(e.target.value)}
            />
          </AmountCard>
        )}
      </div>

      <Button type="submit" disabled={!canContinue} className="mt-[3.8125rem] h-[2.875rem] w-full">
        Next
      </Button>
    </form>
  );
}
