"use client";

import { motion } from "framer-motion";
import { CountUp, SectionHeader, fadeUp, stagger, trackSpotlight } from "./Section";
import { useLocalTime } from "./useLocalTime";

const stats = [
  { label: "CGPA", value: "8.30", sub: "/ 10" },
  { label: "Internships", value: "4", sub: "completed" },
  { label: "Projects", value: "15+", sub: "shipped" },
  { label: "Technologies", value: "25+", sub: "used" },
];

const focus = [
  {
    title: "Agentic AI & LLM systems",
    body: "RAG pipelines, LLM orchestration with Google ADK and Gemini, and a terminal-native coding agent.",
  },
  {
    title: "AI governance & evaluation",
    body: "PII masking, prompt-injection detection, SQL AST validation, and a sub-10ms policy proxy.",
  },
  {
    title: "Full-stack product engineering",
    body: "Rust/Axum and FastAPI backends, Next.js frontends, shipped on GCP to real users.",
  },
];

const academics = [
  { label: "Dean's List", value: "Semester I" },
  { label: "JEE Advanced", value: "AIR 1505 · top 1%" },
  { label: "JEE Main", value: "99.65 percentile" },
];

// Aug 2023 → May 2027. Evaluated once per page load; only drives the bar's animation target.
const DEGREE_START = Date.UTC(2023, 7, 1);
const DEGREE_END = Date.UTC(2027, 4, 31);
const DEGREE_PROGRESS = Math.min(100, Math.max(0, ((Date.now() - DEGREE_START) / (DEGREE_END - DEGREE_START)) * 100));

/** Small label used at the top of every About card. */
const cardLabel = "text-[13px] text-mute";

function NowCard() {
  const time = useLocalTime();
  const rows = [
    { k: "Currently", v: "Final year, B.Tech CSE · IIT Gandhinagar" },
    { k: "Recently", v: "SWE Intern, SF-based stealth startup" },
    { k: "Focus", v: "Safe, evaluated, production AI" },
    { k: "Open to", v: "SWE and AI engineering roles" },
  ];
  return (
    <div className="w-full shrink-0 border border-hairline bg-canvas-soft p-5 card-elevated md:w-[23rem]">
      <div className="flex items-center justify-between text-[13px]">
        <span className="flex items-center gap-2 font-medium text-ink-light">
          <span className="h-1.5 w-1.5 bg-status" aria-hidden="true" />
          Now
        </span>
        <span className="tabular-nums text-mute">{time ? `${time.label} IST` : "Gandhinagar, IN"}</span>
      </div>
      <dl className="mt-4 space-y-2.5 border-t border-hairline pt-4">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[5rem_1fr] gap-3 text-[13px] leading-snug">
            <dt className="text-mute">{r.k}</dt>
            <dd className="text-ink-light/90">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="01"
          eyebrow="About"
          title="A bit about me."
          description={
            <>
              I&apos;m a 4th year B.Tech CSE student at IIT Gandhinagar, passionate about software
              development and agentic AI, particularly{" "}
              <span className="text-ink-light">AI governance, evaluation</span>, and building safe,
              production-ready AI systems. I&apos;ve shipped products across AI infrastructure,
              cybersecurity, algorithmic trading, and full-stack web development.
            </>
          }
          aside={<NowCard />}
        />

        {/* Stats: one bordered strip, divided, calmer than four floating cards */}
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08)}
          className="mt-14 grid grid-cols-2 overflow-hidden border border-hairline bg-canvas-soft card-elevated lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`flex flex-col-reverse p-5 sm:p-6 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${
                i >= 2 ? "border-t border-hairline lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="mt-2 text-[13px] text-mute">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-ink-light sm:text-4xl">
                <CountUp value={stat.value} />
                <span className="ml-1.5 text-sm font-normal tracking-normal text-mute">{stat.sub}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Education + focus areas */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.1, 0.1)}
          className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            onPointerMove={trackSpotlight}
            className="spotlight relative flex flex-col overflow-hidden border border-hairline bg-canvas-soft p-6 card-elevated"
          >
            <div className={cardLabel}>Education</div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink-light">
              B.Tech, Computer Science &amp; Engineering
            </h3>
            <p className="mt-1 text-sm text-body">Indian Institute of Technology Gandhinagar</p>

            <div className="mt-6 flex items-center justify-between text-xs tabular-nums text-mute">
              <span>2023</span>
              <span>2027</span>
            </div>
            {/* Decorative: the caption below states the same thing in text */}
            <div className="mt-2 h-1 overflow-hidden bg-canvas-soft-2" aria-hidden="true">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${DEGREE_PROGRESS}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="h-full bg-accent"
              />
            </div>
            <p className="mt-3 text-xs text-mute">Final year · CPI 8.30 / 10</p>

            <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5">
              {academics.map((a) => (
                <div key={a.label} className="flex items-baseline justify-between gap-4 text-[13px]">
                  <dt className="text-mute">{a.label}</dt>
                  <dd className="text-right text-ink-light/90">{a.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="border border-hairline bg-canvas-soft p-6 card-elevated"
          >
            <div className={cardLabel}>What I work on</div>
            <ol className="mt-4 divide-y divide-hairline">
              {focus.map((f, i) => (
                <li key={f.title} className="grid grid-cols-[2rem_1fr] gap-2 py-5 first:pt-2 last:pb-0">
                  <span className="pt-0.5 font-mono text-xs text-accent" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-tight text-ink-light">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
