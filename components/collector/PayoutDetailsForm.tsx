"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import DateTimeInput from "@/components/ui/DateTimeInput";
import FileDropzone from "@/components/ui/FileDropzone";
import FormField from "@/components/ui/FormField";
import SearchCombobox from "@/components/ui/SearchCombobox";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { MACHINES_BY_VENUE, VENUES } from "@/lib/collector-data";
import { PAYOUT_TYPE_KEY, enabledPayoutTypes, payoutTypeLabel, type PayoutTypeId } from "@/lib/payout-types";
import { useVenues } from "@/lib/use-venues";

function nowForInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function PayoutDetailsForm() {
  const router = useRouter();
  const { venues } = useVenues();
  const [payoutAt, setPayoutAt] = useState("");
  const [payoutType, setPayoutType] = useState<PayoutTypeId | "">("");
  const [venue, setVenue] = useState("");
  const [machine, setMachine] = useState("");
  const [winAmount, setWinAmount] = useState("0");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    setPayoutAt(nowForInput());
  }, []);

  // The Payout Type options are the types this venue switched on in Venue Settings (EGM is always there)
  const venueSettings = venues.find((v) => v.id === venue) ?? null;
  const typeIds = venueSettings ? enabledPayoutTypes(venueSettings) : [];
  const typeOptions = typeIds.map((id) => ({ value: id, label: payoutTypeLabel(id, venueSettings) }));
  // Only a gaming machine win has a machine
  const needsMachine = payoutType === "egm";

  function chooseVenue(nextVenue: string) {
    setVenue(nextVenue);
    setMachine("");
    const next = venues.find((v) => v.id === nextVenue);
    const nextIds = next ? enabledPayoutTypes(next) : [];
    // With a single option there is nothing to choose; otherwise keep the choice if the venue offers it
    if (nextIds.length === 1) setPayoutType(nextIds[0]);
    else if (payoutType !== "" && !nextIds.includes(payoutType)) setPayoutType("");
  }

  const amount = Number(winAmount);
  const canContinue =
    payoutType !== "" &&
    venue !== "" &&
    (!needsMachine || machine !== "") &&
    amount > 0 &&
    confirmAmount === winAmount;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          // Prototype only: the Summary step reads the choice back
          sessionStorage.setItem(
            PAYOUT_TYPE_KEY,
            JSON.stringify({ id: payoutType, label: payoutTypeLabel(payoutType as PayoutTypeId, venueSettings) }),
          );
        } catch {
          // Storage blocked: the Summary shows its mock payout type
        }
        router.push("/collector/payment-breakdown");
      }}
      className="flex flex-col gap-[2.125rem]"
    >
      <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Create New Payout</h1>

      <FormField label="Payout Date and Time" htmlFor="payout-at">
        <DateTimeInput id="payout-at" value={payoutAt} onChange={(e) => setPayoutAt(e.target.value)} />
      </FormField>

      <FormField label="Docket">
        <FileDropzone prompt="Drag and drop docket image here, or click to browse." />
      </FormField>

      <FormField label="Venue" htmlFor="venue">
        <SelectInput id="venue" options={VENUES} value={venue} onChange={(e) => chooseVenue(e.target.value)} />
      </FormField>

      <FormField label="Payout Type" htmlFor="payout-type">
        <SelectInput
          id="payout-type"
          options={typeOptions}
          value={payoutType}
          onChange={(e) => {
            setPayoutType(e.target.value as PayoutTypeId | "");
            setMachine("");
          }}
          disabled={venue === ""}
          placeholder={venue === "" ? "Please select a venue first" : "Please Select"}
        />
      </FormField>

      {needsMachine && (
        <FormField label="Machine" htmlFor="machine">
          <SearchCombobox
            id="machine"
            options={MACHINES_BY_VENUE[venue] ?? []}
            value={machine}
            onChange={setMachine}
            placeholder="Search machines..."
            emptyText="No machines found"
          />
        </FormField>
      )}

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

      <div className="mt-[1.0625rem] flex gap-10">
        <Button variant="outline" href="/" className="h-[2.875rem] flex-1">
          Back
        </Button>
        <Button type="submit" disabled={!canContinue} className="h-[2.875rem] flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}
