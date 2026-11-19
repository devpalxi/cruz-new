// Payout Type (CRP-461): where a payout came from. The checks are the same for every type; the type only
// labels the payout so the venue's accounting system can code it from the bank statement.
//
// One list feeds every screen, the payment file and the patron emails, so wording changes in one place.
// The codes, bank statement text and email lines are PLACEHOLDERS until the venue's finance team sends
// the descriptions they use today (see questions.md, question 4).

import type { Venue } from "./venue-data";

export type PayoutTypeId = "egm" | "member-card" | "gaming-promotion" | "club-promotion";

export type PayoutType = {
  id: PayoutTypeId;
  label: string;
  // Short code placed in the bank statement description (placeholder)
  code: string;
  // How the payout is described to the patron in both emails (placeholder)
  emailNoun: string;
};

export const PAYOUT_TYPES: PayoutType[] = [
  {
    id: "egm",
    label: "EGM",
    code: "EGM",
    emailNoun: "gaming machine win",
  },
  {
    id: "member-card",
    label: "Member Card",
    code: "MEM",
    emailNoun: "member card balance",
  },
  {
    id: "gaming-promotion",
    label: "Gaming Promotion",
    code: "GPR",
    emailNoun: "gaming promotion prize",
  },
  {
    id: "club-promotion",
    label: "Club Promotion",
    code: "CPR",
    emailNoun: "club promotion prize",
  },
];

export const DEFAULT_PAYOUT_TYPE: PayoutTypeId = "egm";

// The bank file reference field holds 18 characters, so the description is cut to fit.
export const BANK_DESCRIPTION_MAX = 18;

// Where the Collector's choice is kept between steps (prototype only)
export const PAYOUT_TYPE_KEY = "cruz-payout-type";

export function getPayoutType(id: string | undefined | null): PayoutType {
  return PAYOUT_TYPES.find((t) => t.id === id) ?? PAYOUT_TYPES[0];
}

// The name shown on screen. A venue can rename Member Card (for example to "MyCash").
export function payoutTypeLabel(id: PayoutTypeId, venue?: Pick<Venue, "memberCardName"> | null): string {
  if (id === "member-card" && venue?.memberCardName.trim()) return venue.memberCardName.trim();
  return getPayoutType(id).label;
}

// The types a venue has switched on. EGM is always available.
export function enabledPayoutTypes(venue: Venue): PayoutTypeId[] {
  const ids: PayoutTypeId[] = ["egm"];
  if (venue.memberCardEnabled) ids.push("member-card");
  if (venue.gamingPromotionEnabled) ids.push("gaming-promotion");
  if (venue.clubPromotionEnabled) ids.push("club-promotion");
  return ids;
}

// Reads the prototype's ?type= value; anything unknown falls back to EGM
export function parsePayoutTypeId(value: string | undefined): PayoutTypeId {
  return getPayoutType(value).id;
}

// "764 MEM V MISHRA": payout number, type code, then the winner's initial and surname (placeholder format).
export function buildBankDescription(payoutId: number, typeId: PayoutTypeId, winnerName: string): string {
  const parts = winnerName.trim().split(/\s+/).filter(Boolean);
  const initial = parts.length > 1 ? parts[0][0] : "";
  const surname = parts.length ? parts[parts.length - 1] : "";
  const text = [String(payoutId), getPayoutType(typeId).code, initial, surname].filter(Boolean).join(" ");
  return text.toUpperCase().slice(0, BANK_DESCRIPTION_MAX);
}

// How the payout is named in the patron emails, using the venue's own Member Card name (placeholder wording)
export function emailNoun(id: PayoutTypeId, venue?: Pick<Venue, "memberCardName"> | null): string {
  if (id === "member-card") return `${payoutTypeLabel(id, venue)} balance`;
  return getPayoutType(id).emailNoun;
}

type Row = { label: string; value: string };

// Payout Details rows on the review pages: the Payout Type first, Machine ID only for a gaming machine
// win, and the Bank Statement Description when the payout goes to a bank account (not a cheque).
export function withPayoutTypeRows(
  rows: Row[],
  opts: {
    typeId: PayoutTypeId;
    venue: Pick<Venue, "memberCardName">;
    payoutId: number;
    winnerName: string;
    paidToBank: boolean;
  },
): Row[] {
  return [
    { label: "Payout Type", value: payoutTypeLabel(opts.typeId, opts.venue) },
    ...rows.filter((row) => opts.typeId === "egm" || row.label !== "Machine ID"),
    ...(opts.paidToBank
      ? [{ label: "Bank Statement Description", value: buildBankDescription(opts.payoutId, opts.typeId, opts.winnerName) }]
      : []),
  ];
}
