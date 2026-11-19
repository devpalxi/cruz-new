"use client";

import { useCallback, useEffect, useState } from "react";
import { PAYOUT_TYPE_DEFAULTS, SEED_VENUES, type Venue } from "@/lib/venue-data";

const KEY = "cruz-venues";

function readSaved(): Venue[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    // Venues saved before the payout type fields existed get the defaults
    if (raw) return (JSON.parse(raw) as Venue[]).map((v) => ({ ...PAYOUT_TYPE_DEFAULTS, ...v }));
  } catch {
    // Storage blocked: fall back to the mock data
  }
  return SEED_VENUES;
}

// Prototype only: saved venue settings live in this browser tab, so reopening a venue shows what was saved.
export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>(SEED_VENUES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVenues(readSaved());
    setReady(true);
  }, []);

  const saveVenue = useCallback((venue: Venue) => {
    const next = readSaved().map((v) => (v.id === venue.id ? venue : v));
    try {
      sessionStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Ignore: the change still shows for this visit
    }
    setVenues(next);
  }, []);

  return { venues, saveVenue, ready };
}
