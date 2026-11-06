"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { XIcon } from "./icons";
import AbackLinks from "./AbackLinks";
import { useLocalTime } from "./useLocalTime";
import { ABACK } from "@/lib/aback";
import { SOCIALS } from "@/lib/site";

const numbers = [
  { value: "2", label: "Products live", note: "Aback Tools · Aback Launch" },
  { value: "3,000+", label: "Free tools", note: "on abacktools.com" },
  { value: "56K", label: "New users in October", note: "AbackTools, up 174%" },
  { value: "DR 44", label: "Aback Launch", note: "domain rating" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function LocalClock() {
  const time = useLocalTime();
  return <span className="tabular-nums">{time ? `${time.label} IST` : "IST (UTC+5:30)"}</span>;
}

/** Hero for /me: same atmosphere as the portfolio hero, written for people rather than recruiters. */
export default function MeHero() {
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      aria-labelledby="me-hero-title"
      onPointerMove={onPointerMove}
      className="hero-interactive relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="top-light absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
        <div className="hero-grid-glow absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[13px] text-body"
        >
          <a
            href={ABACK.group.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 border border-hairline bg-canvas/70 px-3 py-1.5 backdrop-blur transition-colors hover:border-hairline-strong hover:text-ink-light"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-accent" />
            </span>
            Building {ABACK.group.domain}
            <ArrowUpRight size={12} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
          </a>
          <span className="hidden items-center gap-3 font-mono text-xs text-mute sm:flex">
            Gandhinagar, India
            <span className="h-3 w-px bg-hairline-strong" aria-hidden="true" />
            <LocalClock />
          </span>
        </motion.div>

        <motion.h1
          id="me-hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease }}
          className="mt-10 text-[clamp(3rem,9vw,7.75rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-ink-light"
        >
          Building Aback,
          <br />
          <span className="text-mute">in public</span>
          <span className="text-accent">.</span>
        </motion.h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
          >
            <p className="max-w-xl text-lg leading-[1.6] text-body text-pretty sm:text-xl">
              Hey, I&apos;m Devvrat. This is the other side of the site: the{" "}
              <span className="text-ink-light">products I&apos;m building</span> at <AbackLinks text="Aback Group" />, the{" "}
              <span className="text-ink-light">real numbers</span> behind them, and the{" "}
              <span className="text-ink-light">notes and writing</span> I collect along the way.
            </p>
            <p className="mt-4 text-sm text-mute">No resume speak. Just what I&apos;m making and what it&apos;s teaching me.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            className="flex flex-col gap-4 lg:items-end"
          >
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <a
                href="#journey"
                className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
              >
                Follow the journey
                <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <Link
                href="/newsletter"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap border border-hairline-strong bg-canvas/60 px-6 text-sm font-medium text-ink-light backdrop-blur transition-colors hover:border-ink-light"
              >
                <Mail size={14} aria-hidden="true" />
                Get the newsletter
              </Link>
            </div>
            <div className="flex items-center gap-1 text-sm text-mute">
              <Link href="/" className="group inline-flex h-9 items-center gap-1.5 px-2 transition-colors hover:text-ink-light">
                Hiring? See my portfolio
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <span className="mx-1 h-3 w-px bg-hairline-strong" aria-hidden="true" />
              <a
                href={SOCIALS.x.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SOCIALS.x.label} (opens in a new tab)`}
                className="flex h-9 w-9 items-center justify-center transition-colors hover:text-ink-light"
              >
                <XIcon size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* The numbers so far: sits on the content rails, like the portfolio's highlight strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease }}
        className="divider relative z-10"
      >
        <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {numbers.map((h, i) => (
            <div
              key={h.label}
              className={`flex flex-col-reverse justify-end gap-1 px-6 py-6 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${
                i >= 2 ? "border-t border-hairline lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="text-[13px] leading-snug text-body">
                {h.label}
                <span className="mt-0.5 block text-xs text-mute">
                  <AbackLinks text={h.note} />
                </span>
              </dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] text-ink-light">{h.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
