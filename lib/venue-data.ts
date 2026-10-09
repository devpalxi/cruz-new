// Mock data for the Venues list and Venue Settings screens (prototype only)

export type ChequeMode = "collector" | "authoriser" | "both";

export type Venue = {
  id: string;
  name: string;
  client: string;
  dailyLimit: number;
  paymentFileEnabled: boolean;
  venueCode: string;
  chequeEnabled: boolean;
  chequeMode: ChequeMode | "";
};

// One name per thing: change these labels here and every screen follows.
export const FUNDS_TRANSFER_LABEL = "Funds Transfer";
export const PAYMENT_FILE_LABEL = "Payment File for Your Bank";
export const CHEQUE_LABEL = "Cheque";

export const CHEQUE_MODES: { value: ChequeMode; label: string; help: string }[] = [
  {
    value: "collector",
    label: "Collector Only",
    help: "The Collector enters the cheque details. The Authoriser can read them but not change them.",
  },
  {
    value: "authoriser",
    label: "Authoriser Only",
    help: "The Collector does not enter cheque details. The Authoriser enters them before authorising.",
  },
  {
    value: "both",
    label: "Collector and Authoriser Both",
    help: "Either person can enter or correct the cheque details. The Authoriser must complete them before authorising.",
  },
];

// The Admin in this prototype manages this client only
export const ADMIN_CLIENT = "Riverside RSL Group";

export const SEED_VENUES: Venue[] = [
  {
    id: "riverside-rsl-club",
    name: "Riverside RSL Club",
    client: "Riverside RSL Group",
    dailyLimit: 30000,
    paymentFileEnabled: true,
    venueCode: "0042",
    chequeEnabled: true,
    chequeMode: "both",
  },
  {
    id: "northside-sports-club",
    name: "Northside Sports Club",
    client: "Riverside RSL Group",
    dailyLimit: 30000,
    paymentFileEnabled: false,
    venueCode: "",
    chequeEnabled: false,
    chequeMode: "",
  },
  {
    id: "harbourview-hotel",
    name: "Harbourview Hotel",
    client: "Harbourview Hospitality",
    dailyLimit: 20000,
    paymentFileEnabled: true,
    venueCode: "0107",
    chequeEnabled: false,
    chequeMode: "",
  },
  {
    id: "bayside-tavern",
    name: "Bayside Tavern",
    client: "Harbourview Hospitality",
    dailyLimit: 15000,
    paymentFileEnabled: false,
    venueCode: "",
    chequeEnabled: true,
    chequeMode: "collector",
  },
];

export function paymentMethods(venue: Venue): string[] {
  const methods = [FUNDS_TRANSFER_LABEL];
  if (venue.paymentFileEnabled) methods.push(PAYMENT_FILE_LABEL);
  if (venue.chequeEnabled) methods.push(CHEQUE_LABEL);
  return methods;
}

export function formatDailyLimit(amount: number): string {
  return `$${amount.toLocaleString("en-AU")}`;
}
