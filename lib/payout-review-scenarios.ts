import type { PayoutDestinationType } from "./collector-data";
import { CHEQUE_LABEL, FUNDS_TRANSFER_LABEL, PAYMENT_FILE_LABEL, type ChequeMode } from "./venue-data";

// Prototype only: the payouts a reviewer can open, one per way of paying the non-cash amount.
export type ReviewScenarioId =
  | "funds-transfer"
  | "payment-file"
  | "cheque-collector"
  | "cheque-authoriser"
  | "cheque-both";

export type ReviewScenario = {
  id: ReviewScenarioId;
  // Short name for the prototype switcher
  switcherLabel: string;
  destinationType: PayoutDestinationType;
  destinationTitle: string;
  // Who enters the cheque details, as recorded when the payout was submitted
  chequeMode?: ChequeMode;
  cashAmount: string;
  nonCashAmount: string;
  // Bank account details (Funds Transfer and Payment File for Your Bank)
  accountRows: { label: string; value: string }[];
  // What the Collector recorded for a cheque; empty strings mean not entered yet
  cheque?: { number: string; name: string };
};

const ACCOUNT_ROWS = [
  { label: "Account Name", value: "Vivek Mishra" },
  { label: "BSB", value: "015203" },
  { label: "Account Number", value: "02345678" },
];

export const REVIEW_SCENARIOS: ReviewScenario[] = [
  {
    id: "funds-transfer",
    switcherLabel: FUNDS_TRANSFER_LABEL,
    destinationType: "bank",
    destinationTitle: FUNDS_TRANSFER_LABEL,
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: ACCOUNT_ROWS,
  },
  {
    id: "payment-file",
    switcherLabel: PAYMENT_FILE_LABEL,
    destinationType: "manual-bank",
    destinationTitle: PAYMENT_FILE_LABEL,
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: ACCOUNT_ROWS,
  },
  {
    id: "cheque-collector",
    switcherLabel: "Cheque: Collector Only",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "collector",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "000417", name: "Vivek Mishra" },
  },
  {
    id: "cheque-authoriser",
    switcherLabel: "Cheque: Authoriser Only",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "authoriser",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "", name: "" },
  },
  {
    id: "cheque-both",
    switcherLabel: "Cheque: Collector and Authoriser",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "both",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "000418", name: "" },
  },
];

export function getReviewScenario(id: string | undefined, fallback: ReviewScenarioId): ReviewScenario {
  return REVIEW_SCENARIOS.find((s) => s.id === id) ?? REVIEW_SCENARIOS.find((s) => s.id === fallback)!;
}

// The Authoriser enters or completes the cheque details (Authoriser Only, or Collector and Authoriser Both)
export function chequeNeedsAuthoriser(scenario: ReviewScenario): boolean {
  return scenario.destinationType === "cheque" && scenario.chequeMode !== "collector";
}

// Carries the reviewer's reason to the Collector's correction page (prototype only, kept in this browser tab)
export const RETURNED_PAYOUT_KEY = "cruz.returnedPayout";

export type ReturnedPayoutType = "funds-transfer" | "payment-file" | "cheque";

export function returnedTypeFor(scenario: ReviewScenario): ReturnedPayoutType {
  if (scenario.destinationType === "cheque") return "cheque";
  if (scenario.destinationType === "manual-bank") return "payment-file";
  return "funds-transfer";
}

// Prototype only: a payout the reviewer sent back, shown to the Collector for correction
export const RETURNED_PAYOUT = {
  payoutId: 764,
  returnedBy: "R.Nguyen (Authoriser)",
  returnedAt: "24/09/2026 04:10am",
  reasons: {
    "funds-transfer":
      "The account name does not match the winner's name on the ID. Please check the account details with the winner.",
    cheque: "The cheque name does not match the winner's name on the ID. Please check the cheque and correct it.",
    "payment-file": "The BSB does not belong to this account name. Please check the account details with the winner.",
  },
  cheque: { number: "000417", name: "Vivek Mishra Jr" },
  account: { name: "Vivek Mishra", bsb: "015203", number: "02345678" },
};

// Label for the second name in the Name Verification comparison, by how the payout is paid
export function comparedNameLabel(scenario: ReviewScenario): string {
  if (scenario.destinationType === "cheque") return "Name on cheque";
  if (scenario.destinationType === "manual-bank") return "Account name provided";
  return "Provided bank account name";
}
