import { CHEQUE_LABEL, FUNDS_TRANSFER_LABEL, PAYMENT_FILE_LABEL, type Venue } from "@/lib/venue-data";

export type CollectorStep = { label: string; href: string };

export const COLLECTOR_STEPS: CollectorStep[] = [
  { label: "New Payout Details", href: "/collector/payout-details" },
  { label: "Payment Breakdown", href: "/collector/payment-breakdown" },
  { label: "Email Address", href: "/collector/email-address" },
  { label: "Primary ID Document", href: "/collector/primary-id" },
  { label: "Secondary ID (Optional)", href: "/collector/secondary-id" },
  { label: "Payment Method Details", href: "/collector/payout-destination-details" },
  { label: "Summary", href: "/collector/summary" },
  { label: "Approval", href: "/collector/approval" },
];

export type PayoutDestinationType = "bank" | "manual-bank" | "cheque" | "membership-card";

export type PayoutDestination = {
  type: PayoutDestinationType;
  // Venue-customisable display name (prototype: static list; a venue would rename/enable these in Strapi).
  label: string;
};

export const PAYOUT_DESTINATIONS: PayoutDestination[] = [
  { type: "bank", label: FUNDS_TRANSFER_LABEL },
  { type: "manual-bank", label: PAYMENT_FILE_LABEL },
  { type: "cheque", label: CHEQUE_LABEL },
  { type: "membership-card", label: "Membership Card" },
];

// The venue the Collector works at in this prototype (matches a venue on the Venues screen)
export const COLLECTOR_VENUE_ID = "riverside-rsl-club";

// Only the payment methods this venue has switched on are offered (Venue Settings)
export function isDestinationAvailable(type: PayoutDestinationType, venue: Venue | undefined): boolean {
  if (type === "manual-bank") return !!venue?.paymentFileEnabled;
  if (type === "cheque") return !!venue?.chequeEnabled;
  return true;
}

// Carries the single non-cash destination picked on Payment Breakdown through to the Payment Method Details step.
// Only one non-cash destination can be selected per payout.
export const SELECTED_DESTINATION_KEY = "cruz.selectedPayoutDestination";

// Carries the captured destination-specific details (account/cheque/membership fields) from the
// Payment Method Details step through to the Summary step.
export const PAYOUT_DESTINATION_DETAILS_KEY = "cruz.payoutDestinationDetails";

export type PayoutDestinationDetails = {
  type: PayoutDestinationType;
  title: string;
  rows: { label: string; value: string }[];
};

// Mock defaults referenced by the Payment Method Details step (prototype only)
export const MOCK_WINNER_NAME = "Alex Morgan";
export const MOCK_MEMBERSHIP_NUMBER = "M-1234567";

// Manual Bank Transfer has no Zepto CoP check, so it gets a warning-only client-side comparison
// of the entered Account Name against the customer's name. Returns null while the field is empty.
export function getManualBankNameMatch(accountName: string): boolean | null {
  const trimmed = accountName.trim();
  if (trimmed === "") return null;
  return trimmed.toLowerCase() === MOCK_WINNER_NAME.trim().toLowerCase();
}

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

export type CopResult = { status: string; headline?: string; message?: string };

// Mock summary shown on the Summary step (prototype only)
export const MOCK_SUMMARY: {
  payoutId: number;
  createdAt: string;
  payment: { label: string; value: string }[];
  member: { label: string; value: string }[];
  destinations: PayoutDestinationDetails[];
  cop: CopResult;
} = {
  payoutId: 768,
  createdAt: "26/09/2026, 7:23:04 am",
  payment: [
    { label: "Cash Amount", value: "500" },
    { label: "Transfer Amount", value: "500" },
    { label: "Machine ID", value: "EGM-001" },
  ],
  member: [
    { label: "Membership #", value: MOCK_MEMBERSHIP_NUMBER },
    { label: "Email", value: "uat@palxi.com" },
    { label: "Full Name", value: MOCK_WINNER_NAME },
    { label: "Document Type", value: "Drivers Licence" },
    { label: "Document Number", value: "464613123" },
    { label: "Street", value: "Conn Street" },
    { label: "Suburb", value: "Ferntree Gully" },
    { label: "State", value: "VIC" },
    { label: "Post Code", value: "3156" },
    { label: "Country of Issue", value: "Australia" },
  ],
  // Fallback shown when the Summary step is opened directly, without live data captured
  // from the Payment Method Details step (see PAYOUT_DESTINATION_DETAILS_KEY).
  destinations: [
    {
      type: "bank" as PayoutDestinationType,
      title: "Bank Transfer",
      rows: [
        { label: "Account Name", value: MOCK_WINNER_NAME },
        { label: "BSB Number", value: "032-001" },
        { label: "Account Number", value: "343-546-431" },
      ],
    },
  ],
  // The real collector flow only models the happy path (see PayoutDestinationDetailsForm), so
  // this always resolves to a clean Match — just the pill, no alert (see CopValidationCard).
  cop: { status: "Match" },
};

// Reference fixtures for the collector Summary's CoP Validation states page (payout-destination-scenarios).
export const SUMMARY_COP_SCENARIOS: { payoutId: number; cop: CopResult }[] = [
  { payoutId: 776, cop: { status: "Match" } },
  {
    payoutId: 531,
    cop: {
      status: "Close Match",
      headline: "Close match — flagged for approver.",
      message:
        'Entered name "James O\'Sullivan [CM]" differs from registered account name. The payee confirmed to proceed.',
    },
  },
  { payoutId: 532, cop: { status: "No Match" } },
];
