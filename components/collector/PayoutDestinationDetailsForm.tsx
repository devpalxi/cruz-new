"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaBuildingColumns, FaIdCard, FaMoneyBillTransfer, FaMoneyCheckDollar } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import WarningAlert from "@/components/ui/WarningAlert";
import {
  MOCK_MEMBERSHIP_NUMBER,
  MOCK_WINNER_NAME,
  PAYOUT_DESTINATION_DETAILS_KEY,
  PAYOUT_DESTINATIONS,
  SELECTED_DESTINATION_KEY,
  type PayoutDestinationType,
} from "@/lib/collector-data";
import AmountCard from "./AmountCard";
import BankAccountFields from "./BankAccountFields";

const DESTINATION_ICONS: Record<PayoutDestinationType, ReactNode> = {
  bank: <FaBuildingColumns size="2.2rem" />,
  "manual-bank": <FaMoneyBillTransfer size="2.2rem" />,
  cheque: <FaMoneyCheckDollar size="2.2rem" />,
  "membership-card": <FaIdCard size="2.2rem" />,
};

// This prototype only models the happy path — running validation always confirms a match.
const VALIDATE_LABELS: Record<PayoutDestinationType, string> = {
  bank: "Validate Account",
  "manual-bank": "Validate Account",
  cheque: "Validate Cheque",
  "membership-card": "Validate Membership Card",
};

const VALIDATED_MESSAGES: Record<PayoutDestinationType, string> = {
  bank: "Account name matches bank records. Proceeding to summary.",
  "manual-bank": "Account name matches bank records. Proceeding to summary.",
  cheque: "Cheque bearer name matches. Proceeding to summary.",
  "membership-card": "Membership Card ID verified. Proceeding to summary.",
};

export default function PayoutDestinationDetailsForm() {
  const router = useRouter();
  const [destinationType, setDestinationType] = useState<PayoutDestinationType | null>(null);

  // Manual Bank Transfer uses the same bank account details as Bank Transfer, plus a Venue Code.
  const [accountName, setAccountName] = useState("");
  const [bsb, setBsb] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [venueCode, setVenueCode] = useState("");

  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeName, setChequeName] = useState(MOCK_WINNER_NAME);

  const [membershipCardId, setMembershipCardId] = useState(MOCK_MEMBERSHIP_NUMBER);

  // Every destination must be validated before Next appears.
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SELECTED_DESTINATION_KEY);
      setDestinationType(stored ? JSON.parse(stored) : null);
    } catch {
      setDestinationType(null);
    }
  }, []);

  const destination = PAYOUT_DESTINATIONS.find((d) => d.type === destinationType) ?? null;
  const isBankLike = destination?.type === "bank" || destination?.type === "manual-bank";
  const isManualBank = destination?.type === "manual-bank";

  // Re-validate whenever any detail changes after a successful validation.
  function withRevalidate<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setValidated(false);
    };
  }
  const updateAccountName = withRevalidate(setAccountName);
  const updateBsb = withRevalidate(setBsb);
  const updateAccountNumber = withRevalidate(setAccountNumber);
  const updateVenueCode = withRevalidate(setVenueCode);
  const updateChequeNumber = withRevalidate(setChequeNumber);
  const updateChequeName = withRevalidate(setChequeName);
  const updateMembershipCardId = withRevalidate(setMembershipCardId);

  const fieldsComplete =
    destination === null ||
    (isBankLike &&
      accountName !== "" &&
      bsb !== "" &&
      accountNumber !== "" &&
      (!isManualBank || venueCode !== "")) ||
    (destination.type === "cheque" && chequeNumber !== "" && chequeName !== "") ||
    (destination.type === "membership-card" && membershipCardId !== "");

  const canContinue = fieldsComplete && (destination === null || validated);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (destination) {
          const rows = isBankLike
            ? [
                { label: "Account Name", value: accountName },
                { label: "BSB", value: bsb },
                { label: "Account Number", value: accountNumber },
                ...(isManualBank ? [{ label: "Venue Code", value: venueCode }] : []),
              ]
            : destination.type === "cheque"
              ? [
                  { label: "Cheque Number", value: chequeNumber },
                  { label: "Cheque Name", value: chequeName },
                ]
              : [{ label: "Membership Card ID", value: membershipCardId }];

          sessionStorage.setItem(
            PAYOUT_DESTINATION_DETAILS_KEY,
            JSON.stringify({ type: destination.type, title: destination.label, rows }),
          );
        }

        router.push("/collector/summary");
      }}
    >
      <h1 className="mb-[2.125rem] text-[2.5rem] font-bold leading-[2.875rem] text-brand">
        Payout Destination Details
      </h1>

      {destination && (
        <div className="flex flex-col gap-[2.625rem]">
          <AmountCard icon={DESTINATION_ICONS[destination.type]} title={destination.label}>
            {isBankLike && (
              <BankAccountFields
                accountName={accountName}
                onAccountNameChange={updateAccountName}
                bsb={bsb}
                onBsbChange={updateBsb}
                accountNumber={accountNumber}
                onAccountNumberChange={updateAccountNumber}
                venueCode={venueCode}
                onVenueCodeChange={updateVenueCode}
                showVenueCode={isManualBank}
              />
            )}

            {destination.type === "cheque" && (
              <div className="flex flex-col gap-[1.375rem]">
                <FormField label="Cheque Number" htmlFor="cheque-number">
                  <TextInput
                    id="cheque-number"
                    value={chequeNumber}
                    onChange={(e) => updateChequeNumber(e.target.value)}
                  />
                </FormField>
                <FormField label="Cheque Name" htmlFor="cheque-name">
                  <TextInput
                    id="cheque-name"
                    value={chequeName}
                    onChange={(e) => updateChequeName(e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {destination.type === "membership-card" && (
              <FormField label="Membership Card ID" htmlFor="membership-card-id">
                <TextInput
                  id="membership-card-id"
                  value={membershipCardId}
                  onChange={(e) => updateMembershipCardId(e.target.value)}
                />
              </FormField>
            )}

            {validated && (
              <div className="mt-[1.375rem]">
                <WarningAlert tone="success" title={VALIDATED_MESSAGES[destination.type]} />
              </div>
            )}
          </AmountCard>
        </div>
      )}

      <div className="mt-[3.8125rem] flex gap-10">
        <Button variant="outline" href="/collector/secondary-id" className="h-[2.875rem] flex-1">
          Back
        </Button>
        {destination && !validated ? (
          <Button
            key="validate"
            type="button"
            disabled={!fieldsComplete}
            onClick={() => setValidated(true)}
            className="h-[2.875rem] flex-1"
          >
            {VALIDATE_LABELS[destination.type]}
          </Button>
        ) : (
          <Button key="next" type="submit" disabled={!canContinue} className="h-[2.875rem] flex-1">
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
