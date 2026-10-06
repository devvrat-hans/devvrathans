"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, XIcon } from "./icons";
import { useLocalTime } from "./useLocalTime";
import { SOCIALS } from "@/lib/site";

const highlights = [
  { value: "Top 10", label: "Accenture Innovation Challenge '26", note: "of 3,000+ teams · PPO" },
  { value: "Runner-Up", label: "Adani Finnovate Hackathon '25", note: "Team leader" },
  { value: "AIR 1505", label: "JEE Advanced", note: "Top 1% nationally" },
  { value: "4", label: "Internships", note: "AI infra · product · trading · security" },
];

const focusAreas = ["Agentic AI", "AI governance & evaluation", "Full-stack products"];

const socials = [
  { ...SOCIALS.github, Icon: GithubIcon },
  { ...SOCIALS.linkedin, Icon: LinkedinIcon },
  { ...SOCIALS.x, Icon: XIcon },
];

const ease = [0.22, 1, 0.36, 1] as const;

function LocalClock() {
  const time = useLocalTime();
  return <span className="tabular-nums">{time ? `${time.label} IST` : "IST (UTC+5:30)"}</span>;
}

export default function Hero() {
  // Feed the pointer position to the grid-reveal layer (.hero-grid-glow).
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="hero-interactive relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {/* Atmosphere */}
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="top-light absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
        <div className="hero-grid-glow absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16">
        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[13px] text-body"
        >
          <span className="inline-flex items-center gap-2.5 border border-hairline bg-canvas/70 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 bg-status" aria-hidden="true" />
            Open to new opportunities
          </span>
          <span className="hidden items-center gap-3 font-mono text-xs text-mute sm:flex">
            Gandhinagar, India
            <span className="h-3 w-px bg-hairline-strong" aria-hidden="true" />
            <LocalClock />
          </span>
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease }}
          className="mt-10 text-[clamp(3.5rem,11vw,9rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-ink-light"
        >
          Devvrat Hans<span className="text-accent">.</span>
        </motion.h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
          >
            <p className="max-w-xl text-lg leading-[1.6] text-body text-pretty sm:text-xl">
              Software engineer building{" "}
              <span className="text-ink-light">agentic AI</span>,{" "}
              <span className="text-ink-light">AI governance &amp; evaluation</span> tooling, and{" "}
              <span className="text-ink-light">full-stack products</span>.
            </p>
            <p className="mt-4 text-sm text-mute">B.Tech Computer Science &amp; Engineering · IIT Gandhinagar</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
              {focusAreas.map((f) => (
                <li key={f} className="border border-hairline bg-canvas/60 px-2.5 py-1 font-mono text-[11px] text-body backdrop-blur">
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            className="flex flex-col gap-4 lg:items-end"
          >
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <a
                href="#projects"
                className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
              >
                View my work
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center whitespace-nowrap border border-hairline-strong bg-canvas/60 px-6 text-sm font-medium text-ink-light backdrop-blur transition-colors hover:border-ink-light"
              >
                Get in touch
              </a>
            </div>
            <div className="flex items-center gap-1 text-sm text-mute">
              <Link
                href="/resume"
                className="inline-flex h-9 items-center gap-1.5 px-2 transition-colors hover:text-ink-light"
              >
                <FileText size={14} aria-hidden="true" />
                Resume
              </Link>
              <span className="mx-1 h-3 w-px bg-hairline-strong" aria-hidden="true" />
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="flex h-9 w-9 items-center justify-center transition-colors hover:text-ink-light"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Highlight strip: sits on the content rails */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease }}
        className="divider relative z-10"
      >
        <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className={`flex flex-col-reverse justify-end gap-1 px-6 py-6 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${
                i >= 2 ? "border-t border-hairline lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="text-[13px] leading-snug text-body">
                {h.label}
                <span className="mt-0.5 block text-xs text-mute">{h.note}</span>
              </dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] text-ink-light">{h.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
