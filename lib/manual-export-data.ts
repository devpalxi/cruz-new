// Mock data for the Manual Bank Transfer Export page (prototype only).
// Only payouts that are authorised AND have served the venue payment delay appear here.

export type ManualExportRow = {
  id: number;
  venueCode: string;
  amount: number;
  bsb: string;
  accountNumber: string;
  accountName: string;
  collectedAt: string; // ISO
  lastExportedAt: string | null; // ISO; null = never exported
};

export const VENUE_CODES: Record<string, string> = {
  "Riverside RSL Club": "RRSL",
  "Northside Sports Club": "NSC",
};

export const MANUAL_EXPORT_ROWS: ManualExportRow[] = [
  // Ready to export (Pending Payment)
  { id: 781, venueCode: "RRSL", amount: 1250, bsb: "062-000", accountNumber: "10234567", accountName: "Sarah Thompson", collectedAt: "2026-09-26T14:20:00", lastExportedAt: null },
  { id: 777, venueCode: "RRSL", amount: 640, bsb: "033-157", accountNumber: "0981234", accountName: "Daniel Nguyen", collectedAt: "2026-09-25T19:05:00", lastExportedAt: null },
  { id: 769, venueCode: "NSC", amount: 880, bsb: "082-401", accountNumber: "53120098", accountName: "Priya Sharma", collectedAt: "2026-09-25T11:42:00", lastExportedAt: null },
  { id: 766, venueCode: "RRSL", amount: 300, bsb: "015-203", accountNumber: "02345678", accountName: "Vivek Mishra", collectedAt: "2026-09-24T21:15:00", lastExportedAt: null },
  { id: 761, venueCode: "NSC", amount: 1500, bsb: "732-012", accountNumber: "661044", accountName: "Liam O'Connor", collectedAt: "2026-09-23T16:30:00", lastExportedAt: null },
  { id: 759, venueCode: "RRSL", amount: 520, bsb: "063-010", accountNumber: "00123456", accountName: "Mei Chen", collectedAt: "2026-09-22T09:50:00", lastExportedAt: null },
  // Previously exported (Payment Completed)
  { id: 750, venueCode: "RRSL", amount: 900, bsb: "062-000", accountNumber: "11770022", accountName: "James Walker", collectedAt: "2026-09-16T13:10:00", lastExportedAt: "2026-09-19T10:05:00" },
  { id: 747, venueCode: "NSC", amount: 2100, bsb: "083-004", accountNumber: "40981122", accountName: "Aisha Rahman", collectedAt: "2026-09-15T20:40:00", lastExportedAt: "2026-09-19T10:05:00" },
  { id: 741, venueCode: "RRSL", amount: 450, bsb: "033-000", accountNumber: "0456789", accountName: "Tom Baker", collectedAt: "2026-09-12T18:25:00", lastExportedAt: "2026-09-15T09:30:00" },
  { id: 738, venueCode: "RRSL", amount: 1200, bsb: "015-010", accountNumber: "07650321", accountName: "Grace Lee", collectedAt: "2026-09-10T15:00:00", lastExportedAt: "2026-09-15T09:30:00" },
  { id: 731, venueCode: "NSC", amount: 760, bsb: "082-182", accountNumber: "30011445", accountName: "Noah Wilson", collectedAt: "2026-09-05T12:12:00", lastExportedAt: "2026-09-08T11:45:00" },
  { id: 726, venueCode: "RRSL", amount: 330, bsb: "062-692", accountNumber: "10556677", accountName: "Olivia Brown", collectedAt: "2026-09-02T19:48:00", lastExportedAt: "2026-09-08T11:45:00" },
  { id: 719, venueCode: "RRSL", amount: 1800, bsb: "733-500", accountNumber: "812009", accountName: "Ethan Patel", collectedAt: "2026-08-28T22:05:00", lastExportedAt: "2026-09-01T14:20:00" },
  { id: 712, venueCode: "NSC", amount: 610, bsb: "083-125", accountNumber: "22098761", accountName: "Chloe Martin", collectedAt: "2026-08-25T10:35:00", lastExportedAt: "2026-09-01T14:20:00" },
];

const pad = (n: number) => String(n).padStart(2, "0");

// "26/09/2026 14:20"
export function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function nowIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export const CSV_HEADERS = [
  "Payout ID",
  "Venue Code",
  "Bank Transfer Amount",
  "BSB",
  "Account Number",
  "Account Name",
  "Last Exported DateTime",
  "Collection DateTime",
];

// Leading "=" + quotes keeps BSB/account numbers as text in Excel (no dropped leading zeros).
const asText = (v: string) => `="${v}"`;
const quote = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function buildCsv(rows: ManualExportRow[]) {
  const lines = rows.map((r) =>
    [
      String(r.id),
      r.venueCode,
      r.amount.toFixed(2),
      asText(r.bsb),
      asText(r.accountNumber),
      quote(r.accountName),
      r.lastExportedAt ? formatDateTime(r.lastExportedAt) : "",
      formatDateTime(r.collectedAt),
    ].join(","),
  );
  return [CSV_HEADERS.join(","), ...lines].join("\r\n");
}

export function exportFilename() {
  const d = new Date();
  return `manual-bank-transfers-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
}
