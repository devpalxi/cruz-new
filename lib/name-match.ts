// Cheque name match (prototype only). A small, local stand-in for the real similarity check:
// it ignores case, extra spaces and common punctuation, treats re-ordered names as equal and
// gives partial credit for initials and missing parts. No server is called.

// Default threshold. A Super Admin setting (CHE-05) will replace this; changes apply to new payouts only.
export const NAME_MATCH_THRESHOLD = 0.7;

// Where the name the cheque is compared with came from
export type NameSource = "id" | "captured" | "none";

export type NameMatchStatus = "match" | "no-match" | "unable";

export type NameMatchResult = {
  status: NameMatchStatus;
  source: NameSource;
  // 0 to 1, or null when the names cannot be compared. Never made up.
  score: number | null;
  percent: number | null;
  thresholdPercent: number;
  // Why the names could not be compared
  reason?: string;
};

export const NAME_SOURCE_LABELS: Record<NameSource, string> = {
  id: "Verified ID Name",
  captured: "Captured Name",
  none: "Captured Name",
};

export const NAME_NOT_VERIFIED_NOTE = "Name is not verified using ID documents.";

export function normaliseName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,'’`]/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

// How well two single name parts agree: 1 for equal, 0.5 for an initial, a ratio for a small typo, else 0
function tokenScore(a: string, b: string): number {
  if (a === b) return 1;
  if ((a.length === 1 && b.startsWith(a)) || (b.length === 1 && a.startsWith(b))) return 0.5;
  const ratio = 1 - editDistance(a, b) / Math.max(a.length, b.length);
  return ratio >= 0.8 ? ratio : 0;
}

// 0 to 1. Each name part is paired with its best partner once, so the order of the parts does not matter.
export function nameSimilarity(first: string, second: string): number {
  const a = normaliseName(first).split(" ").filter(Boolean);
  const b = normaliseName(second).split(" ").filter(Boolean);
  if (a.length === 0 || b.length === 0) return 0;

  const pairs: { i: number; j: number; score: number }[] = [];
  a.forEach((x, i) => b.forEach((y, j) => pairs.push({ i, j, score: tokenScore(x, y) })));
  pairs.sort((p, q) => q.score - p.score);

  const usedA = new Set<number>();
  const usedB = new Set<number>();
  let total = 0;
  for (const pair of pairs) {
    if (pair.score === 0 || usedA.has(pair.i) || usedB.has(pair.j)) continue;
    usedA.add(pair.i);
    usedB.add(pair.j);
    total += pair.score;
  }
  return total / Math.max(a.length, b.length);
}

type EvaluateInput = {
  chequeName: string;
  comparedName: string;
  source: NameSource;
  threshold?: number;
};

export function evaluateNameMatch({
  chequeName,
  comparedName,
  source,
  threshold = NAME_MATCH_THRESHOLD,
}: EvaluateInput): NameMatchResult {
  const thresholdPercent = Math.round(threshold * 100);

  if (chequeName.trim() === "") {
    return { status: "unable", source, score: null, percent: null, thresholdPercent, reason: "Cheque name is not entered yet." };
  }
  if (source === "none" || comparedName.trim() === "") {
    return {
      status: "unable",
      source,
      score: null,
      percent: null,
      thresholdPercent,
      reason: "No ID name or captured recipient name is available.",
    };
  }

  const score = nameSimilarity(chequeName, comparedName);
  const percent = Math.round(score * 100);
  return {
    status: percent >= thresholdPercent ? "match" : "no-match",
    source,
    score,
    percent,
    thresholdPercent,
  };
}

// One saved decision about a name difference (CHE-22)
export type NameCheckRecord = {
  id: string;
  recordedAt: string;
  authoriser: string;
  chequeName: string;
  comparedName: string;
  source: NameSource;
  percent: number;
  thresholdPercent: number;
  rationale: string;
  acknowledged: boolean;
  // The active decision is the one that applies to the payout now. Earlier ones are kept as history.
  active: boolean;
};
