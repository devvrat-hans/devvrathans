"use client";

import { useSyncExternalStore } from "react";

export const HOME_TIME_ZONE = "Asia/Kolkata";

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};

const formatters = new Map<string, Intl.DateTimeFormat>();
const formatterFor = (timeZone: string) => {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", hourCycle: "h23" });
    formatters.set(timeZone, f);
  }
  return f;
};

/**
 * Live wall-clock time in `timeZone`, refreshed every 15s.
 * Returns null during SSR / before hydration so markup never mismatches.
 */
export function useLocalTime(timeZone = HOME_TIME_ZONE): { label: string; hour: number } | null {
  // The snapshot is a primitive string so React can compare it cheaply between ticks.
  const snapshot = useSyncExternalStore(
    subscribe,
    () => {
      const parts = formatterFor(timeZone).formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
      return `${hour}:${minute}`;
    },
    () => ""
  );
  if (!snapshot) return null;

  const [h, m] = snapshot.split(":");
  const hour = Number(h);
  const display = `${((hour + 11) % 12) + 1}:${m} ${hour < 12 ? "AM" : "PM"}`;
  return { label: display, hour };
}
