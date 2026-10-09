import type { PayoutDestinationType } from "./collector-data";

// Mock payout awaiting approval (prototype only)
export const MOCK_APPROVAL = {
  payoutId: 764,
  createdAt: "24/09/2026, 3:23:31 am",
  status: "Awaiting Approval",
  user: "D.Walsh",
  payout: [
    { label: "Cash Amount", value: "140" },
    { label: "Bank Transfer Amount", value: "500" },
    { label: "Internal Transaction ID", value: "98765432187" },
    { label: "Machine ID", value: "EGM-001" },
  ],
  member: [
    { label: "Membership #", value: "1234567" },
    { label: "Email", value: "vkwins@gmail.com" },
    { label: "Full Name", value: "Vivek Mishra" },
    { label: "Document Type", value: "No ID document" },
  ],
  identityConfirmation: [
    { label: "Identity Documents Provided To Staff Member", yes: false },
    { label: "Identity manually verified", yes: false },
  ],
  // The single payout destination the collector selected on Payment Breakdown
  // (only one non-cash destination can be selected per payout).
  destinations: [
    {
      type: "bank" as PayoutDestinationType,
      title: "Bank Transfer",
      rows: [
        { label: "Account Name", value: "Vivek Mishra" },
        { label: "BSB Number", value: "015203" },
        { label: "Account Number", value: "02345678" },
      ],
    },
  ],
  nameVerification: { idName: "Vivek Mishra", otherName: "Vivek Mishra", match: true },
  aml: { title: "AML Screening", check: "PEP - Clear", result: "CLEAR" },
  idvHistory: [
    { country: "Australia Manual KYC (No ID)", dateTime: "24 Sept 2026, 7:59 am", result: "-" },
  ],
  collector: { email: "Vivek@Cruz.Money", at: "24/09/2026 03:30am" },
  approvals: { copStatus: "Match", nameMatch: true },
};

export const RISK_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Reference fixtures for the payout-destination name-match states page
// (components/approver/DestinationNameScenarios.tsx). The three "bank" entries (Match, Close
// Match, No Match) are what's actually rendered there. Manual Bank Transfer and Cheque follow the
// same pattern (showCop: false, and Cheque uses "Cheque bearer name") — kept here as a starting
// point for building those states out later; Membership Card has no name field to compare.
export const DESTINATION_NAME_SCENARIOS: {
  type: PayoutDestinationType;
  label: string;
  idName: string;
  otherName: string;
  otherLabel: string;
  nameMatchLabel: string;
  showCop: boolean;
  copStatus?: string;
  copTone?: "success" | "warning" | "danger";
  copAlert?: { headline: string; message: string };
  match: boolean;
}[] = [
  {
    type: "bank",
    label: "Match",
    idName: "Alex Mendis",
    otherName: "Alex Mendis",
    otherLabel: "Provided bank account name",
    nameMatchLabel: "ID Name Match",
    showCop: true,
    copStatus: "Match",
    copTone: "success",
    match: true,
  },
  {
    type: "bank",
    label: "Close Match",
    idName: "James O'Sullivan",
    otherName: "James O'Sullivan [CM]",
    otherLabel: "Provided bank account name",
    nameMatchLabel: "ID Name Match",
    showCop: true,
    copStatus: "Close Match",
    copTone: "warning",
    copAlert: {
      headline: "Close match — flagged for approver.",
      message:
        'Entered name "James O\'Sullivan [CM]" differs from registered account name. The payee confirmed to proceed.',
    },
    match: false,
  },
  {
    type: "bank",
    label: "No Match",
    idName: "James O'Sullivan",
    otherName: "James O'Sullivan [INM]",
    otherLabel: "Provided bank account name",
    nameMatchLabel: "ID Name Match",
    showCop: true,
    copStatus: "No Match",
    copTone: "danger",
    match: false,
  },
  {
    type: "manual-bank",
    label: "Manual Bank Transfer",
    idName: "Alex Mendis",
    otherName: "Peter",
    otherLabel: "Provided bank account name",
    nameMatchLabel: "Account Name Match",
    showCop: false,
    match: false,
  },
  {
    type: "cheque",
    label: "Cheque",
    idName: "Alex Mendis",
    otherName: "Peter",
    otherLabel: "Cheque bearer name",
    nameMatchLabel: "Bearer Name Match",
    showCop: false,
    match: false,
  },
];
