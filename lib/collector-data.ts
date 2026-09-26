export const COLLECTOR_STEPS = [
  "New Payout Details",
  "Payment Breakdown",
  "Email Address",
  "Primary ID Document",
  "Secondary ID (Optional)",
  "Bank Account",
  "Summary",
  "Approval",
] as const;

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
