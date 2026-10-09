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
  COLLECTOR_VENUE_ID,
  isDestinationAvailable,
  MOCK_MEMBERSHIP_NUMBER,
  MOCK_WINNER_NAME,
  PAYOUT_DESTINATION_DETAILS_KEY,
  PAYOUT_DESTINATIONS,
  SELECTED_DESTINATION_KEY,
  type PayoutDestinationType,
} from "@/lib/collector-data";
import { useVenues } from "@/lib/use-venues";
import AmountCard from "./AmountCard";
import BankAccountFields from "./BankAccountFields";
import ChequeDetailsFields from "./ChequeDetailsFields";

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
  const { venues, ready } = useVenues();
  const venue = venues.find((v) => v.id === COLLECTOR_VENUE_ID);
  const [destinationType, setDestinationType] = useState<PayoutDestinationType | null>(null);

  // The payment file uses the same bank account details as Funds Transfer. Its venue code comes from Venue Settings.
  const [accountName, setAccountName] = useState("");
  const [bsb, setBsb] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeName, setChequeName] = useState(MOCK_WINNER_NAME);

  const [membershipCardId, setMembershipCardId] = useState(MOCK_MEMBERSHIP_NUMBER);

  // Messages stay hidden until the Collector tries to continue.
  const [showErrors, setShowErrors] = useState(false);
  // Checks that need a validation step must pass it before Next appears.
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
  const isPaymentFile = destination?.type === "manual-bank";
  const isCheque = destination?.type === "cheque";
  const chequeMode = venue?.chequeMode || "collector";

  // The venue may have switched this method off since it was chosen. Entered details are kept.
  const unavailable = ready && destination !== null && !isDestinationAvailable(destination.type, venue);

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
  const updateChequeNumber = withRevalidate(setChequeNumber);
  const updateChequeName = withRevalidate(setChequeName);
  const updateMembershipCardId = withRevalidate(setMembershipCardId);

  const bankErrors = {
    accountName: accountName.trim() === "" ? "Enter the account name." : undefined,
    bsb: /^\d{3}-?\d{3}$/.test(bsb.trim()) ? undefined : "Enter a 6-digit BSB, for example 032-001.",
    accountNumber:
      accountNumber.trim() === ""
        ? "Enter the account number."
        : /^[\d\s-]+$/.test(accountNumber)
          ? undefined
          : "The account number can only contain digits.",
  };
  const chequeErrors = {
    chequeNumber: chequeNumber.trim() === "" ? "Enter the cheque number." : undefined,
    chequeName: chequeName.trim() === "" ? "Enter the name on the cheque." : undefined,
  };

  // Cheque details are only required from the Collector when the venue says the Collector enters them.
  const chequeCollectorRequired = isCheque && chequeMode === "collector";
  const needsValidation = destination !== null && (!isCheque || chequeCollectorRequired);

  const fieldsComplete =
    destination === null ||
    (isBankLike && !bankErrors.accountName && !bankErrors.bsb && !bankErrors.accountNumber) ||
    (isCheque && (!chequeCollectorRequired || (!chequeErrors.chequeNumber && !chequeErrors.chequeName))) ||
    (destination.type === "membership-card" && membershipCardId !== "");

  const canContinue = !unavailable && fieldsComplete && (!needsValidation || validated);

  function savedChequeRows() {
    if (chequeMode === "authoriser") return [{ label: "Cheque Details", value: "To be entered by the Authoriser" }];
    return [
      { label: "Cheque Number", value: chequeNumber.trim() || "Not entered yet" },
      { label: "Cheque Name", value: chequeName.trim() || "Not entered yet" },
    ];
  }

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
              ]
            : isCheque
              ? savedChequeRows()
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

      {unavailable && destination && (
        <div className="mb-[2.625rem]">
          <WarningAlert
            title={`${destination.label} is no longer available at this venue.`}
            message="Go back to Payment Breakdown and choose another way to pay the rest. The details you entered here are kept."
          />
        </div>
      )}

      {destination && (
        <div className="flex flex-col gap-[2.625rem]">
          <AmountCard icon={DESTINATION_ICONS[destination.type]} title={destination.label}>
            {isPaymentFile && (
              <p className="mb-[1.375rem] text-base text-subtle">
                Your venue arranges this payment itself. The details below go into the payment file your team uploads
                to your bank. The bank is not paid automatically.
              </p>
            )}

            {isBankLike && (
              <BankAccountFields
                accountName={accountName}
                onAccountNameChange={updateAccountName}
                bsb={bsb}
                onBsbChange={updateBsb}
                accountNumber={accountNumber}
                onAccountNumberChange={updateAccountNumber}
                errors={showErrors ? bankErrors : {}}
              />
            )}

            {isCheque && (
              <ChequeDetailsFields
                mode={chequeMode}
                chequeNumber={chequeNumber}
                onChequeNumberChange={updateChequeNumber}
                chequeName={chequeName}
                onChequeNameChange={updateChequeName}
                errors={showErrors && chequeCollectorRequired ? chequeErrors : {}}
              />
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
        {destination && needsValidation && !validated ? (
          <Button
            key="validate"
            type="button"
            disabled={unavailable}
            onClick={() => {
              if (fieldsComplete) setValidated(true);
              else setShowErrors(true);
            }}
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
