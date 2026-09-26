export type CollectorStep = { label: string; href: string };

export const COLLECTOR_STEPS: CollectorStep[] = [
  { label: "New Payout Details", href: "/collector/payout-details" },
  { label: "Payment Breakdown", href: "/collector/payment-breakdown" },
  { label: "Email Address", href: "/collector/email-address" },
  { label: "Primary ID Document", href: "/collector/primary-id" },
  { label: "Secondary ID (Optional)", href: "/collector/secondary-id" },
  { label: "Bank Account", href: "/collector/bank-account" },
  { label: "Summary", href: "/collector/summary" },
  { label: "Approval", href: "/collector/approval" },
];

export const PAYOUT_TYPES = [
  { value: "egm", label: "EGM" },
  { value: "tab", label: "TAB" },
  { value: "keno", label: "Keno" },
];

export const VENUES = [{ value: "riverside-rsl", label: "Riverside RSL Club" }];

export const MACHINES_BY_VENUE: Record<
  string,
  { value: string; title: string; meta: string }[]
> = {
  "riverside-rsl": [
    { value: "EGM-001", title: "Aristocrat Lightning Link 1", meta: "ID: EGM-001 | Serial: SN-AR-00112" },
    { value: "EGM-002", title: "Aristocrat Lightning Link 2", meta: "ID: EGM-002 | Serial: SN-AR-00113" },
    { value: "EGM-003", title: "Aristocrat Lightning Link 3", meta: "ID: EGM-003 | Serial: SN-AR-00114" },
    { value: "EGM-004", title: "Aristocrat Dragon Link 1", meta: "ID: EGM-004 | Serial: SN-AR-00201" },
    { value: "EGM-005", title: "Aristocrat Dragon Link 2", meta: "ID: EGM-005 | Serial: SN-AR-00202" },
    { value: "EGM-006", title: "Aristocrat Buffalo Gold 1", meta: "ID: EGM-006 | Serial: SN-AR-00305" },
    { value: "EGM-007", title: "Aristocrat Buffalo Gold 2", meta: "ID: EGM-007 | Serial: SN-AR-00306" },
    { value: "EGM-008", title: "Aristocrat Queen of the Nile", meta: "ID: EGM-008 | Serial: SN-AR-00410" },
    { value: "EGM-009", title: "Everi Fortune Coin 1", meta: "ID: EGM-009 | Serial: SN-EVE-5501" },
    { value: "EGM-010", title: "Everi Fortune Coin 2", meta: "ID: EGM-010 | Serial: SN-EVE-5502" },
  ],
};

// Mock total carried over from step 1 (prototype only)
export const MOCK_TOTAL_WINNINGS = 1000;

// Mock summary shown on the Summary step (prototype only)
export const MOCK_SUMMARY = {
  payoutId: 768,
  createdAt: "26/09/2026, 7:23:04 am",
  payment: [
    { label: "Cash Amount", value: "500" },
    { label: "Transfer Amount", value: "500" },
    { label: "Machine ID", value: "EGM-001" },
  ],
  member: [
    { label: "Membership #", value: "dfdg" },
    { label: "Email", value: "uat@palxi.com" },
    { label: "Full Name", value: "dfd fgf" },
    { label: "Document Type", value: "Drivers Licence" },
    { label: "Document Number", value: "464613123" },
    { label: "Street", value: "Conn Street" },
    { label: "Suburb", value: "Ferntree Gully" },
    { label: "State", value: "VIC" },
    { label: "Post Code", value: "3156" },
    { label: "Country of Issue", value: "Australia" },
  ],
  bank: [
    { label: "Account Name", value: "[CM]aus" },
    { label: "BSB Number", value: "032-001" },
    { label: "Account Number", value: "343-546-431" },
  ],
  cop: {
    status: "Close Match",
    headline: "Close match — flagged for approver.",
    message:
      'Entered name "[CM]aus" differs from registered account name. The payee confirmed to proceed.',
  },
};
