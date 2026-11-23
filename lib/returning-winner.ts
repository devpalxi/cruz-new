// CRP-186 Re-using winner details (prototype only).
// When the Collector enters a membership number, Cruz looks for an earlier winner of the same client.
// A passed, complete, recent identity check can be re-used so the ID screens and the FrankieOne check
// are skipped. The real system matches on the server; this file only mocks the outcomes.

import {
  ID_DOCUMENT_LABELS,
  getCountryLabel,
  type IdAddress,
  type IdCapture,
  type IdDocumentType,
} from "./id-document-config";
import type { Venue } from "./venue-data";

export type LastCheckResult = "passed" | "failed" | "manual";

export type SavedWinner = {
  membershipNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  country: string;
  document: IdDocumentType;
  documentNumber: string;
  documentExpiry: string; // ISO date
  details: Record<string, string>;
  address: IdAddress;
  lastCheck: { result: LastCheckResult; checkedAt: string; payoutId: number };
};

export type LookupStatus =
  | "reusable"
  | "too-old"
  | "document-expired"
  | "not-passed"
  | "not-found"
  | "no-number"
  | "duplicate"
  | "reuse-off";

export type LookupResult = { status: LookupStatus; winner?: SavedWinner; reuseDays?: number };

// Only these outcomes show the Returning Winner screen. The others go straight to the normal ID screens.
export const SHOWS_RETURNING_SCREEN: LookupStatus[] = ["reusable", "too-old", "document-expired", "not-passed"];

const ADDRESS: IdAddress = {
  unit: "",
  streetNumber: "10",
  streetName: "Conn Street",
  suburb: "Ferntree Gully",
  state: "VIC",
  postCode: "3156",
};

function winner(
  membershipNumber: string,
  name: [string, string],
  lastCheck: SavedWinner["lastCheck"],
  documentExpiry: string,
): SavedWinner {
  return {
    membershipNumber,
    firstName: name[0],
    middleName: "",
    lastName: name[1],
    dateOfBirth: "1986-04-17",
    country: "AUS",
    document: "driver-licence",
    documentNumber: "046461312",
    documentExpiry,
    details: { state: "VIC", licenceNumber: "046461312", cardNumber: "P1234567" },
    address: ADDRESS,
    lastCheck,
  };
}

// Mock earlier winners of this client. 5678901 is held by two records (a duplicate).
export const SAVED_WINNERS: SavedWinner[] = [
  winner("1234567", ["Vivek", "Mishra"], { result: "passed", checkedAt: "2026-08-12T14:14:00", payoutId: 712 }, "2029-03-31"),
  winner("2345678", ["Sarah", "Thompson"], { result: "passed", checkedAt: "2025-06-03T10:40:00", payoutId: 402 }, "2030-01-15"),
  winner("3456789", ["Daniel", "Nguyen"], { result: "passed", checkedAt: "2026-09-30T19:05:00", payoutId: 744 }, "2026-10-31"),
  winner("4567890", ["Priya", "Sharma"], { result: "manual", checkedAt: "2026-10-02T11:42:00", payoutId: 751 }, "2028-07-01"),
  winner("5678901", ["Liam", "O'Connor"], { result: "passed", checkedAt: "2026-07-20T16:30:00", payoutId: 690 }, "2028-02-01"),
  winner("5678901", ["Liam", "Connor"], { result: "passed", checkedAt: "2026-05-11T12:00:00", payoutId: 611 }, "2027-12-01"),
];

// Prototype-only shortcuts to each outcome on the Returning Winner screen
export const RETURNING_SCENARIOS: { value: string; label: string }[] = [
  { value: "1234567", label: "Can be re-used" },
  { value: "2345678", label: "Check too old" },
  { value: "3456789", label: "ID document expired" },
  { value: "4567890", label: "Last check not passed" },
];

// Spaces and punctuation don't make a different member: "123 4567" and "123-4567" match "1234567"
export function normaliseMembershipNumber(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function lookupReturningWinner(membershipNumber: string, venue: Pick<Venue, "idvReuseEnabled" | "idvReuseDays"> | null, now = new Date()): LookupResult {
  const key = normaliseMembershipNumber(membershipNumber);
  if (!key) return { status: "no-number" };

  const reuseDays = Number(venue?.idvReuseDays);
  if (!venue || !venue.idvReuseEnabled || !venue.idvReuseDays.trim() || !Number.isFinite(reuseDays) || reuseDays <= 0) return { status: "reuse-off" };

  const matches = SAVED_WINNERS.filter((w) => normaliseMembershipNumber(w.membershipNumber) === key);
  if (matches.length === 0) return { status: "not-found", reuseDays };
  // Two records for one number: never guess which person it is
  if (matches.length > 1) return { status: "duplicate", reuseDays };

  const found = matches[0];
  if (found.lastCheck.result !== "passed") return { status: "not-passed", winner: found, reuseDays };

  const checkedAt = new Date(found.lastCheck.checkedAt);
  // A missing, invalid or future check date is never re-used
  if (Number.isNaN(checkedAt.getTime()) || checkedAt > now) return { status: "not-passed", winner: found, reuseDays };
  if (now.getTime() - checkedAt.getTime() > reuseDays * DAY_MS) return { status: "too-old", winner: found, reuseDays };

  // An ID document that has expired (or expires today) needs a new check, even inside the re-use period
  const expiry = new Date(`${found.documentExpiry}T23:59:59`);
  if (expiry.getTime() - now.getTime() < DAY_MS) return { status: "document-expired", winner: found, reuseDays };

  return { status: "reusable", winner: found, reuseDays };
}

const pad = (n: number) => String(n).padStart(2, "0");

// "12/08/2026"
export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Only the last 3 characters are shown on the gaming floor
export function maskDocumentNumber(value: string): string {
  return value.length <= 3 ? value : `${"*".repeat(value.length - 3)}${value.slice(-3)}`;
}

export function fullName(w: SavedWinner): string {
  return [w.firstName, w.middleName, w.lastName].filter(Boolean).join(" ");
}

// The saved record as the Collector sees it before re-using it
export function savedWinnerRows(w: SavedWinner): { label: string; value: string }[] {
  return [
    { label: "Full Name", value: fullName(w) },
    { label: "Date of Birth", value: formatDate(w.dateOfBirth) },
    { label: "Document Type", value: `${getCountryLabel(w.country)} ${ID_DOCUMENT_LABELS[w.document]}` },
    { label: "Document Number", value: maskDocumentNumber(w.documentNumber) },
    { label: "Document Expiry", value: formatDate(w.documentExpiry) },
    { label: "Suburb", value: `${w.address.suburb} ${w.address.state}` },
  ];
}

// The saved record in the shape the Primary ID step stores, so the Summary shows it
export function toIdCapture(w: SavedWinner): IdCapture {
  return {
    country: w.country,
    document: w.document,
    details: w.details,
    firstName: w.firstName,
    middleName: w.middleName,
    lastName: w.lastName,
    dateOfBirth: w.dateOfBirth,
    address: w.address,
    checkResult: "passed",
  };
}

// Set when the Collector re-uses a check, so later steps know no new check was run (prototype only)
export const IDV_REUSE_KEY = "cruz.idvReuse";
export type IdvReuse = { payoutId: number; checkedAt: string };

// The re-used check shown on the Approver and Authoriser pages (?idv=reused)
export const REVIEW_REUSED_CHECK = {
  document: "Australia Driver Licence",
  checkedAt: "2026-08-12T14:14:00",
  dateTimeText: "12 Aug 2026, 2:14 pm",
  payoutId: 712,
};

export const IDV_REVIEW_OPTIONS = [
  { value: "new", label: "New check" },
  { value: "reused", label: "Re-used" },
];

type IdvRow = { country: string; dateTime: string; result: string };

// IDV History rows and note for the review pages. A re-used check lists the earlier check it came from.
export function reviewIdvHistory(rows: IdvRow[], reused: boolean): { rows: IdvRow[]; reusedNote?: string } {
  if (!reused) return { rows };
  const c = REVIEW_REUSED_CHECK;
  return {
    rows: [{ country: `${c.document} (re-used)`, dateTime: c.dateTimeText, result: "Pass" }],
    reusedNote: `Re-used from payout #${c.payoutId}, checked ${formatDate(c.checkedAt)}. No new identity check was run for this payout.`,
  };
}
