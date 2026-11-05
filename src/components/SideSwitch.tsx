"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMode } from "./ModeProvider";
import { useSide } from "./useSide";
import { SIDES, type Side } from "@/lib/site";

const ORDER: Side[] = ["portfolio", "me"];

/**
 * Segmented switch between the two versions of the site. Each option is a plain link to that
 * side's home, so it works without JS; the pill slides across when the route changes.
 */
export default function SideSwitch({
  className = "inline-flex",
  pillId = "side-pill",
  onNavigate,
}: {
  /** Must include the display utility (e.g. "hidden md:inline-flex"), so callers control visibility. */
  className?: string;
  /** Unique per mounted instance, so two switches (bar + mobile menu) never share one pill. */
  pillId?: string;
  onNavigate?: () => void;
}) {
  const { side } = useSide();
  const { mode, setMode } = useMode();

  return (
    <div role="group" aria-label="Site version" className={`border border-hairline bg-canvas/60 p-0.5 ${className}`}>
      {ORDER.map((s) => {
        const active = s === side;
        return (
          <Link
            key={s}
            href={SIDES[s].href}
            onClick={() => {
              if (mode === "terminal") setMode("website");
              onNavigate?.();
            }}
            aria-current={active ? "true" : undefined}
            className={`relative inline-flex h-7 flex-1 items-center justify-center whitespace-nowrap px-2.5 text-xs font-medium transition-colors ${
              active ? "text-on-primary" : "text-body hover:text-ink-light"
            }`}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{SIDES[s].label}</span>
          </Link>
        );
      })}
    </div>
  );
}
