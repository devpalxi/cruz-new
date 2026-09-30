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
  batchId: string | null; // null = never exported
};

// One export = one batch. Exported payouts are "Awaiting ABA Reference" until the bank issues the
// ABA reference (after it processes the file) and it is entered; then they become Payment Completed.
export type ExportBatch = {
  id: string;
  exportedAt: string; // ISO, fixed at first export
  abaReference: string | null; // null = awaiting ABA reference
  payoutIds: number[];
};

export const VENUE_CODES: Record<string, string> = {
  "Riverside RSL Club": "RRSL",
  "Northside Sports Club": "NSC",
};

export const EXPORT_BATCHES: ExportBatch[] = [
  { id: "B-0925", exportedAt: "2026-09-25T09:10:00", abaReference: null, payoutIds: [709, 708, 707, 706, 705, 704, 703, 702, 701, 700] },
  { id: "B-0927", exportedAt: "2026-09-27T16:40:00", abaReference: null, payoutIds: [766, 759] },
  { id: "B-0919", exportedAt: "2026-09-19T10:05:00", abaReference: "ABA-20260919-0412", payoutIds: [750, 747] },
  { id: "B-0915", exportedAt: "2026-09-15T09:30:00", abaReference: "ABA-20260915-0388", payoutIds: [741, 738] },
  { id: "B-0908", exportedAt: "2026-09-08T11:45:00", abaReference: "ABA-20260908-0351", payoutIds: [731, 726] },
  { id: "B-0901", exportedAt: "2026-09-01T14:20:00", abaReference: "ABA-20260901-0317", payoutIds: [719, 712] },
];

export const MANUAL_EXPORT_ROWS: ManualExportRow[] = [
  // Ready to export (Pending Payment); B-0927 rows are exported and Awaiting ABA Reference
  { id: 781, venueCode: "RRSL", amount: 1250, bsb: "062-000", accountNumber: "10234567", accountName: "Sarah Thompson", collectedAt: "2026-09-26T14:20:00", batchId: null },
  { id: 777, venueCode: "RRSL", amount: 640, bsb: "033-157", accountNumber: "0981234", accountName: "Daniel Nguyen", collectedAt: "2026-09-25T19:05:00", batchId: null },
  { id: 769, venueCode: "NSC", amount: 880, bsb: "082-401", accountNumber: "53120098", accountName: "Priya Sharma", collectedAt: "2026-09-25T11:42:00", batchId: null },
  { id: 766, venueCode: "RRSL", amount: 300, bsb: "015-203", accountNumber: "02345678", accountName: "Vivek Mishra", collectedAt: "2026-09-24T21:15:00", batchId: "B-0927" },
  { id: 761, venueCode: "NSC", amount: 1500, bsb: "732-012", accountNumber: "661044", accountName: "Liam O'Connor", collectedAt: "2026-09-23T16:30:00", batchId: null },
  { id: 759, venueCode: "RRSL", amount: 520, bsb: "063-010", accountNumber: "00123456", accountName: "Mei Chen", collectedAt: "2026-09-22T09:50:00", batchId: "B-0927" },
  // Batch B-0925: 10 payouts, Awaiting ABA Reference (shows the "+N more" expand)
  { id: 709, venueCode: "NSC", amount: 210, bsb: "062-128", accountNumber: "10998811", accountName: "Hannah Scott", collectedAt: "2026-09-20T10:15:00", batchId: "B-0925" },
  { id: 708, venueCode: "RRSL", amount: 1180, bsb: "033-044", accountNumber: "0765401", accountName: "Jack Kim", collectedAt: "2026-09-20T11:15:00", batchId: "B-0925" },
  { id: 707, venueCode: "RRSL", amount: 95, bsb: "082-900", accountNumber: "44120973", accountName: "Zoe Adams", collectedAt: "2026-09-20T12:15:00", batchId: "B-0925" },
  { id: 706, venueCode: "NSC", amount: 430, bsb: "015-555", accountNumber: "07711223", accountName: "Ryan Cooper", collectedAt: "2026-09-19T13:15:00", batchId: "B-0925" },
  { id: 705, venueCode: "RRSL", amount: 760, bsb: "063-101", accountNumber: "00998877", accountName: "Isla Murphy", collectedAt: "2026-09-19T14:15:00", batchId: "B-0925" },
  { id: 704, venueCode: "RRSL", amount: 2200, bsb: "732-400", accountNumber: "551903", accountName: "Lucas Reid", collectedAt: "2026-09-19T15:15:00", batchId: "B-0925" },
  { id: 703, venueCode: "NSC", amount: 340, bsb: "083-210", accountNumber: "60023145", accountName: "Ava Turner", collectedAt: "2026-09-18T16:15:00", batchId: "B-0925" },
  { id: 702, venueCode: "RRSL", amount: 875, bsb: "062-300", accountNumber: "10334455", accountName: "Mason Gray", collectedAt: "2026-09-18T17:15:00", batchId: "B-0925" },
  { id: 701, venueCode: "RRSL", amount: 150, bsb: "033-201", accountNumber: "0843210", accountName: "Ella Price", collectedAt: "2026-09-18T18:15:00", batchId: "B-0925" },
  { id: 700, venueCode: "NSC", amount: 1025, bsb: "082-017", accountNumber: "31107765", accountName: "Leo Hughes", collectedAt: "2026-09-17T19:15:00", batchId: "B-0925" },
  // Previously exported (Payment Completed)
  { id: 750, venueCode: "RRSL", amount: 900, bsb: "062-000", accountNumber: "11770022", accountName: "James Walker", collectedAt: "2026-09-16T13:10:00", batchId: "B-0919" },
  { id: 747, venueCode: "NSC", amount: 2100, bsb: "083-004", accountNumber: "40981122", accountName: "Aisha Rahman", collectedAt: "2026-09-15T20:40:00", batchId: "B-0919" },
  { id: 741, venueCode: "RRSL", amount: 450, bsb: "033-000", accountNumber: "0456789", accountName: "Tom Baker", collectedAt: "2026-09-12T18:25:00", batchId: "B-0915" },
  { id: 738, venueCode: "RRSL", amount: 1200, bsb: "015-010", accountNumber: "07650321", accountName: "Grace Lee", collectedAt: "2026-09-10T15:00:00", batchId: "B-0915" },
  { id: 731, venueCode: "NSC", amount: 760, bsb: "082-182", accountNumber: "30011445", accountName: "Noah Wilson", collectedAt: "2026-09-05T12:12:00", batchId: "B-0908" },
  { id: 726, venueCode: "RRSL", amount: 330, bsb: "062-692", accountNumber: "10556677", accountName: "Olivia Brown", collectedAt: "2026-09-02T19:48:00", batchId: "B-0908" },
  { id: 719, venueCode: "RRSL", amount: 1800, bsb: "733-500", accountNumber: "812009", accountName: "Ethan Patel", collectedAt: "2026-08-28T22:05:00", batchId: "B-0901" },
  { id: 712, venueCode: "NSC", amount: 610, bsb: "083-125", accountNumber: "22098761", accountName: "Chloe Martin", collectedAt: "2026-08-25T10:35:00", batchId: "B-0901" },
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
      formatDateTime(r.collectedAt),
    ].join(","),
  );
  return [CSV_HEADERS.join(","), ...lines].join("\r\n");
}

export function exportFilename() {
  const d = new Date();
  return `manual-bank-transfers-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
}
