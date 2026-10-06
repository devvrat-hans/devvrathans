"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** Consistent eyebrow + headline + lead paragraph used by every home section. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  aside,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  aside?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "flex flex-col items-center" : ""}>
        <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-mute">
          <span className="font-mono tracking-normal text-accent">{index}</span>
          <span className="h-px w-6 bg-hairline-strong" aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 className="mt-5 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink-light text-balance sm:text-[3.25rem]">
          {title}
        </h2>
        {description && (
          <p className={`mt-5 max-w-2xl text-[17px] leading-[1.65] text-body text-pretty sm:text-lg ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        )}
      </div>
      {aside}
    </motion.div>
  );
}

/** Tracks the pointer so `.spotlight` cards can paint a soft glow under the cursor. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/**
 * Counts a stat like "8.30", "15+" or "1,273" up from zero the first time it scrolls into view.
 * The final value is server-rendered, so it reads correctly without JS and for reduced-motion users.
 */
export function CountUp({ value, duration = 1.1 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const started = useRef(false);

  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(numeric.replace(/,/g, ""));
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  const grouped = numeric.includes(",");
  const animatable = Boolean(match) && Number.isFinite(target) && !reduce;

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    return `${prefix}${grouped ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals }) : fixed}${suffix}`;
  };

  // Reset to zero before the stat is seen (it is hidden by its parent's fade-in at that point).
  useEffect(() => {
    if (!animatable || started.current || inView || !ref.current) return;
    ref.current.textContent = format(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatable]);

  useEffect(() => {
    if (!animatable || !inView || started.current) return;
    started.current = true;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        if (ref.current) ref.current.textContent = format(n);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatable, inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
