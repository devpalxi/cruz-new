import type { PayoutDestinationType } from "./collector-data";
import { evaluateNameMatch, type NameCheckRecord, type NameMatchResult, type NameSource } from "./name-match";
import { CHEQUE_LABEL, FUNDS_TRANSFER_LABEL, PAYMENT_FILE_LABEL, type ChequeMode } from "./venue-data";

// Prototype only: the payouts a reviewer can open, one per way of paying the non-cash amount.
export type ReviewScenarioId =
  | "funds-transfer"
  | "payment-file"
  | "cheque-collector"
  | "cheque-authoriser"
  | "cheque-both"
  | "cheque-no-match"
  | "cheque-captured-name"
  | "cheque-unable";

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
  // The people who actually entered cheque details so far, by username. Empty means nobody yet.
  chequeEnteredBy?: string[];
  // What the cheque name is compared with. Absent for payouts that are not cheques.
  nameCheck?: {
    source: NameSource;
    comparedName: string;
    // Earlier decisions about a name difference on this payout
    history?: NameCheckRecord[];
  };
  // Conditions still holding back payment, apart from the Authoriser's own steps (prototype only)
  paymentHold?: { waitRemaining?: string; dailyLimitReason?: string };
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
    chequeEnteredBy: ["M.Santos (Collector)"],
    nameCheck: { source: "id", comparedName: "Vivek Mishra" },
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
    chequeEnteredBy: [],
    nameCheck: { source: "id", comparedName: "Vivek Mishra" },
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
    chequeEnteredBy: ["M.Santos (Collector)"],
    nameCheck: { source: "id", comparedName: "Vivek Mishra" },
  },
  {
    id: "cheque-no-match",
    switcherLabel: "Cheque: Name differs",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "both",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "000421", name: "Vivek Mishra Jr" },
    chequeEnteredBy: ["M.Santos (Collector)"],
    nameCheck: {
      source: "id",
      comparedName: "Vivek Mishra",
      history: [
        {
          id: "earlier-1",
          recordedAt: "23/09/2026 04:12pm",
          authoriser: "R.Nguyen",
          chequeName: "Vivek Mishra Snr",
          comparedName: "Vivek Mishra",
          source: "id",
          percent: 67,
          thresholdPercent: 70,
          rationale: "Winner confirmed by phone that the cheque is made out to Vivek Mishra Snr.",
          acknowledged: true,
          active: false,
        },
      ],
    },
    paymentHold: { waitRemaining: "3 hours 20 minutes" },
  },
  {
    id: "cheque-captured-name",
    switcherLabel: "Cheque: Captured name",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "collector",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "000419", name: "Vivek Mishra" },
    chequeEnteredBy: ["M.Santos (Collector)"],
    nameCheck: { source: "captured", comparedName: "Vivek Mishra" },
  },
  {
    id: "cheque-unable",
    switcherLabel: "Cheque: Cannot compare",
    destinationType: "cheque",
    destinationTitle: CHEQUE_LABEL,
    chequeMode: "collector",
    cashAmount: "140",
    nonCashAmount: "500",
    accountRows: [],
    cheque: { number: "000420", name: "Vivek Mishra" },
    chequeEnteredBy: ["M.Santos (Collector)"],
    nameCheck: { source: "none", comparedName: "" },
    paymentHold: { dailyLimitReason: "The venue's daily limit is reached. Payment is retried the next day." },
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

// A payout checked against an ID document shows the ID document type; one with no ID shows "No ID document"
export function memberRowsFor(scenario: ReviewScenario, rows: { label: string; value: string }[]) {
  const source = scenario.nameCheck?.source;
  if (!source) return rows;
  return rows.map((row) =>
    row.label === "Document Type" ? { ...row, value: source === "id" ? "Drivers Licence" : "No ID document" } : row,
  );
}

export function identityLinesFor(
  scenario: ReviewScenario,
  lines: { label: string; yes: boolean }[],
) {
  const source = scenario.nameCheck?.source;
  if (!source) return lines;
  return lines.map((line) =>
    line.label.startsWith("Identity Documents Provided") ? { ...line, yes: source === "id" } : line,
  );
}

// The cheque name check for a payout, or null when the payout has nothing to compare (not a cheque)
export function nameCheckFor(scenario: ReviewScenario, chequeName: string): NameMatchResult | null {
  if (!scenario.nameCheck) return null;
  return evaluateNameMatch({
    chequeName,
    comparedName: scenario.nameCheck.comparedName,
    source: scenario.nameCheck.source,
  });
}
