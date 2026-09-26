"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import DateTimeInput from "@/components/ui/DateTimeInput";
import FileDropzone from "@/components/ui/FileDropzone";
import FormField from "@/components/ui/FormField";
import SearchCombobox from "@/components/ui/SearchCombobox";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { MACHINES_BY_VENUE, PAYOUT_TYPES, VENUES } from "@/lib/collector-data";

function nowForInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function PayoutDetailsForm() {
  const [payoutAt, setPayoutAt] = useState("");
  const [payoutType, setPayoutType] = useState("");
  const [venue, setVenue] = useState("");
  const [machine, setMachine] = useState("");
  const [winAmount, setWinAmount] = useState("0");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    setPayoutAt(nowForInput());
  }, []);

  const amount = Number(winAmount);
  const canContinue =
    payoutType !== "" &&
    venue !== "" &&
    machine !== "" &&
    amount > 0 &&
    confirmAmount === winAmount;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-[34px]"
    >
      <h1 className="text-[40px] font-bold leading-[46px] text-brand">Create New Payout</h1>

      <FormField label="Payout Date and Time" htmlFor="payout-at">
        <DateTimeInput id="payout-at" value={payoutAt} onChange={(e) => setPayoutAt(e.target.value)} />
      </FormField>

      <FormField label="Docket">
        <FileDropzone prompt="Drag and drop docket image here, or click to browse." />
      </FormField>

      <FormField label="Payout Type" htmlFor="payout-type">
        <SelectInput
          id="payout-type"
          options={PAYOUT_TYPES}
          value={payoutType}
          onChange={(e) => setPayoutType(e.target.value)}
        />
      </FormField>

      <FormField label="Venue" htmlFor="venue">
        <SelectInput
          id="venue"
          options={VENUES}
          value={venue}
          onChange={(e) => {
            setVenue(e.target.value);
            setMachine("");
          }}
        />
      </FormField>

      <FormField label="Machine" htmlFor="machine">
        <SearchCombobox
          id="machine"
          options={MACHINES_BY_VENUE[venue] ?? []}
          value={machine}
          onChange={setMachine}
          disabled={venue === ""}
          placeholder="Search machines..."
          disabledPlaceholder="Please select a venue first"
          emptyText="No machines found"
        />
      </FormField>

      <FormField label="Win Amount" htmlFor="win-amount">
        <TextInput
          id="win-amount"
          type="number"
          min="0"
          inputMode="decimal"
          value={winAmount}
          onChange={(e) => setWinAmount(e.target.value)}
        />
      </FormField>

      <FormField label="Confirm Win Amount" htmlFor="confirm-win-amount">
        <TextInput
          id="confirm-win-amount"
          type="number"
          min="0"
          inputMode="decimal"
          value={confirmAmount}
          onChange={(e) => setConfirmAmount(e.target.value)}
        />
      </FormField>

      <FormField label="Internal Transaction ID" htmlFor="transaction-id">
        <TextInput
          id="transaction-id"
          placeholder="Internal Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </FormField>

      <div className="mt-[17px] flex gap-10">
        <Button variant="outline" href="/" className="h-[46px] flex-1">
          Back
        </Button>
        <Button type="submit" disabled={!canContinue} className="h-[46px] flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}
