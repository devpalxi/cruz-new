import { VENUES } from "./collector-data";

export { VENUES as EXPORT_VENUES };

export type ManageMenuItem = { label: string; href: string };

// Items shown in the header's "Manage" dropdown. Users and Machines aren't built yet — they fall
// through to the placeholder page (app/admin/manage/[item]/page.tsx), same pattern as the
// collector flow's unbuilt steps.
export const ADMIN_MANAGE_ITEMS: ManageMenuItem[] = [
  { label: "Users", href: "/admin/manage/users" },
  { label: "Machines", href: "/admin/manage/machines" },
  { label: "Export Manual Bank Transfers", href: "/admin/manage/export-manual-bank-transfers" },
];

export type ManualBankTransfer = {
  payoutId: number;
  // Matches a VENUES value — used to filter the export.
  venue: string;
  // Strapi-editable field included in the export file (distinct from the venue itself).
  venueCode: string;
  amount: number;
  bsb: string;
  accountNumber: string;
  accountName: string;
  collectedAt: string;
};

// Authorised Manual Bank Transfer payouts awaiting export, before an admin has exported them
// (prototype only — a real payout would reach this state via the authoriser workflow).
export const MOCK_UNEXPORTED_MANUAL_BANK_TRANSFERS: ManualBankTransfer[] = [
  {
    payoutId: 781,
    venue: "riverside-rsl",
    venueCode: "RVS-001",
    amount: 640,
    bsb: "062-000",
    accountNumber: "11223344",
    accountName: "Alex Morgan",
    collectedAt: "28/09/2026, 4:12 pm",
  },
  {
    payoutId: 784,
    venue: "riverside-rsl",
    venueCode: "RVS-001",
    amount: 320,
    bsb: "083-004",
    accountNumber: "55667788",
    accountName: "Priya Chandran",
    collectedAt: "28/09/2026, 6:45 pm",
  },
  {
    payoutId: 790,
    venue: "riverside-rsl",
    venueCode: "RVS-001",
    amount: 1150,
    bsb: "013-921",
    accountNumber: "99001122",
    accountName: "Jordan Blake",
    collectedAt: "29/09/2026, 11:20 am",
  },
];
