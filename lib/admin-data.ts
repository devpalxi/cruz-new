// Mock data for the Venue Admin Payouts Dashboard (prototype only)

export type Check =
  | { kind: "none" }
  | { kind: "text"; value: string }
  | { kind: "fail" }
  | { kind: "pass"; value: string }
  | { kind: "closeMatch" };

export type PayoutStatus =
  | "Draft"
  | "Awaiting Approval"
  | "Pending Authorisation"
  | "Pending Payment"
  | "Payment Delayed"
  | "Payment Processing"
  | "Payment Completed"
  | "Rejected"
  | "Failed"
  | "Cancelled";

export type AdminPayoutRow = {
  id: number;
  date: string;
  time: string;
  venue: string;
  idMatch: Check;
  pep: Check;
  sanction: Check;
  cop: Check;
  amount: number;
  status: PayoutStatus;
};

export const PAYOUT_STATUSES: PayoutStatus[] = [
  "Draft",
  "Awaiting Approval",
  "Pending Authorisation",
  "Pending Payment",
  "Payment Delayed",
  "Payment Processing",
  "Payment Completed",
  "Rejected",
  "Failed",
  "Cancelled",
];

export const ADMIN_USER = "Venue.Admin";
export const TOTAL_RESULTS = 211;

const manual: Check = { kind: "text", value: "Manual Verification" };
const none: Check = { kind: "none" };
const fail: Check = { kind: "fail" };
const match: Check = { kind: "pass", value: "Match" };
const no: Check = { kind: "pass", value: "No" };
const RSL = "Riverside RSL Club";

export const ADMIN_PAYOUTS: AdminPayoutRow[] = [
  { id: 780, date: "Sep 29, 2026", time: "04:15PM", venue: RSL, idMatch: manual, pep: none, sanction: none, cop: match, amount: 40, status: "Awaiting Approval" },
  { id: 779, date: "Sep 29, 2026", time: "04:02PM", venue: RSL, idMatch: manual, pep: none, sanction: none, cop: match, amount: 50, status: "Awaiting Approval" },
  { id: 778, date: "Sep 29, 2026", time: "11:13AM", venue: RSL, idMatch: manual, pep: none, sanction: none, cop: match, amount: 5500, status: "Awaiting Approval" },
  { id: 776, date: "Sep 29, 2026", time: "10:03AM", venue: RSL, idMatch: { kind: "text", value: "None" }, pep: none, sanction: none, cop: none, amount: 2500, status: "Draft" },
  { id: 775, date: "Sep 28, 2026", time: "05:01PM", venue: RSL, idMatch: manual, pep: no, sanction: none, cop: none, amount: 300, status: "Draft" },
  { id: 774, date: "Sep 28, 2026", time: "04:58PM", venue: RSL, idMatch: { kind: "pass", value: "Pass" }, pep: none, sanction: none, cop: match, amount: 111, status: "Draft" },
  { id: 773, date: "Sep 28, 2026", time: "04:48PM", venue: RSL, idMatch: manual, pep: no, sanction: none, cop: match, amount: 700, status: "Draft" },
  { id: 772, date: "Sep 28, 2026", time: "04:39PM", venue: RSL, idMatch: manual, pep: no, sanction: none, cop: match, amount: 70, status: "Draft" },
  { id: 771, date: "Sep 28, 2026", time: "04:31PM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 45, status: "Draft" },
  { id: 770, date: "Sep 28, 2026", time: "04:25PM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 55, status: "Awaiting Approval" },
  { id: 768, date: "Sep 26, 2026", time: "08:09AM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: { kind: "closeMatch" }, amount: 1000, status: "Awaiting Approval" },
  { id: 764, date: "Sep 24, 2026", time: "03:23AM", venue: RSL, idMatch: manual, pep: no, sanction: none, cop: match, amount: 80, status: "Awaiting Approval" },
  { id: 762, date: "Sep 23, 2026", time: "11:06AM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 100, status: "Awaiting Approval" },
  { id: 758, date: "Sep 18, 2026", time: "10:33PM", venue: RSL, idMatch: { kind: "text", value: "Server Was Not Available" }, pep: none, sanction: none, cop: match, amount: 100, status: "Draft" },
  { id: 757, date: "Sep 18, 2026", time: "06:01PM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 100, status: "Awaiting Approval" },
  { id: 756, date: "Sep 18, 2026", time: "10:04AM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 333, status: "Draft" },
  { id: 755, date: "Sep 18, 2026", time: "07:54AM", venue: RSL, idMatch: fail, pep: none, sanction: none, cop: match, amount: 90, status: "Awaiting Approval" },
  { id: 753, date: "Sep 17, 2026", time: "03:58PM", venue: RSL, idMatch: manual, pep: no, sanction: none, cop: match, amount: 40, status: "Payment Completed" },
  { id: 752, date: "Sep 17, 2026", time: "10:45AM", venue: RSL, idMatch: manual, pep: none, sanction: none, cop: match, amount: 60, status: "Awaiting Approval" },
  { id: 751, date: "Sep 17, 2026", time: "07:04AM", venue: "Northside Sports Club", idMatch: fail, pep: none, sanction: none, cop: match, amount: 10, status: "Awaiting Approval" },
];
