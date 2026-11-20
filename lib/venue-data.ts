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
  // Payout types the Collector can pick (CRP-461). EGM is always available.
  memberCardEnabled: boolean;
  gamingPromotionEnabled: boolean;
  clubPromotionEnabled: boolean;
  // Optional name for Member Card on this venue, for example "MyCash". Blank uses "Member Card".
  memberCardName: string;
  // CRP-186: whether a returning winner's passed identity check can be re-used, and for how many days
  idvReuseEnabled: boolean;
  idvReuseDays: string;
};

// Defaults for fields added after the first Venue Settings build (payout types, identity check re-use).
// Also applied to venues saved in this browser tab before these fields existed.
export const NEW_VENUE_FIELD_DEFAULTS: Pick<
  Venue,
  "memberCardEnabled" | "gamingPromotionEnabled" | "clubPromotionEnabled" | "memberCardName" | "idvReuseEnabled" | "idvReuseDays"
> = {
  memberCardEnabled: false,
  gamingPromotionEnabled: false,
  clubPromotionEnabled: false,
  memberCardName: "",
  idvReuseEnabled: false,
  idvReuseDays: "",
};

// Longest re-use period a venue can set for an identity check (about 12 months)
export const MAX_IDV_REUSE_DAYS = 365;

// One name per thing: change these labels here and every screen follows.
export const FUNDS_TRANSFER_LABEL = "Electronic Fund Transfer";
export const PAYMENT_FILE_LABEL = "Manual Bank Transfer";
export const CHEQUE_LABEL = "Cheque";

export const CHEQUE_MODES: { value: ChequeMode; label: string; help: string }[] = [
  {
    value: "collector",
    label: "Collector Only",
    help: "Collector enters the cheque details. Authoriser can view them.",
  },
  {
    value: "authoriser",
    label: "Authoriser Only",
    help: "Authoriser enters the cheque details.",
  },
  {
    value: "both",
    label: "Collector and Authoriser Both",
    help: "Both can enter and edit the cheque details.",
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
    memberCardEnabled: true,
    gamingPromotionEnabled: true,
    clubPromotionEnabled: true,
    memberCardName: "MyCash",
    idvReuseEnabled: true,
    idvReuseDays: "365",
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
    ...NEW_VENUE_FIELD_DEFAULTS,
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
    ...NEW_VENUE_FIELD_DEFAULTS,
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
    ...NEW_VENUE_FIELD_DEFAULTS,
  },
];

// The venue the mock payouts on the Approver and Authoriser pages belong to (prototype only)
export const REVIEW_VENUE: Venue = SEED_VENUES[0];

export function paymentMethods(venue: Venue): string[] {
  const methods = [FUNDS_TRANSFER_LABEL];
  if (venue.paymentFileEnabled) methods.push(PAYMENT_FILE_LABEL);
  if (venue.chequeEnabled) methods.push(CHEQUE_LABEL);
  return methods;
}

export function formatDailyLimit(amount: number): string {
  return `$${amount.toLocaleString("en-AU")}`;
}
