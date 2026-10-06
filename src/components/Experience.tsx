"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { SectionHeader, fadeUp, stagger } from "./Section";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  duration: string;
  domain: string;
  highlights: string[];
  tags: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    company: "Stealth startup · San Francisco",
    period: "Feb '26 to Jul '26",
    duration: "6 mos",
    domain: "AI infrastructure",
    highlights: [
      "Architected a Case Management Application from scratch using Rust, Axum, PostgreSQL and Next.js, enabling case monitoring, reviewer workflows, and HITL oversight.",
      "Built production RAG infrastructure covering document extraction, configurable chunking, Gemini embeddings, and similarity retrieval.",
      "Implemented AI governance & evaluation controls: PII masking, prompt-injection detection, AST-based SQL validation, and BYOK credential management.",
      "Developed LLM orchestration systems with Python, FastAPI, Google ADK and Gemini, including schema grounding, context compression, and async BI execution.",
    ],
    tags: ["Rust", "Axum", "PostgreSQL", "Next.js", "Python", "FastAPI", "GCP"],
  },
  {
    role: "Founder's Office (Technology)",
    company: "Aback.ai",
    period: "Jun '25 to Feb '26",
    duration: "9 mos",
    domain: "AI products",
    highlights: [
      "Led technology across software architecture, AI integration, workflow automation, backend, frontend, and cloud deployment.",
      "Built and launched AbackTools.com, an AI-powered tools platform attracting ~500 clicks/day.",
      "Contributed to QRliee, Invoice Management, Inventory Management, and AI Recruitment Portal products.",
    ],
    tags: ["Full Stack", "AI/ML", "Product", "Cloud"],
  },
  {
    role: "Development Intern",
    company: "Trado (Windigo Trade)",
    period: "Nov '25 to Jan '26",
    duration: "3 mos",
    domain: "Algorithmic trading",
    highlights: [
      "Developed an algorithmic trading platform on the LEAN engine, adapting its architecture to company-specific infrastructure.",
      "Built an end-to-end pipeline for historical backtesting and live algorithmic trading.",
      "Solely led development of Connect by Trado from scratch.",
    ],
    tags: ["Python", "LEAN", "Trading", "API"],
  },
  {
    role: "Development Intern",
    company: "Curlsek AI Technologies",
    period: "Mar '25 to Jul '25",
    duration: "5 mos",
    domain: "Cybersecurity",
    highlights: [
      "Built the core PoC for an AI-powered cybersecurity portal, with AI agents detecting SQL injection and automating security testing.",
      "Designed secure auth APIs using Spring Boot and MongoDB with RBAC and session management.",
    ],
    tags: ["Spring Boot", "MongoDB", "Security", "AI"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="02"
          eyebrow="Experience"
          title="Where I've worked."
          description="Four internships across AI infrastructure, product, trading, and security, each one shipping real software to real users."
          aside={
            <Link
              href="/resume"
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              <FileText size={14} aria-hidden="true" />
              Full resume
              <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </Link>
          }
        />

        {/* Ledger: one ruled row per role, dates in a sticky left column */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.1)}
          className="mt-14 border-t border-hairline-strong"
        >
          {experiences.map((exp, i) => (
            <motion.li
              key={exp.company}
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="group relative grid grid-cols-1 gap-5 border-b border-hairline py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:py-10"
            >
              {/* Accent tick on the leading edge of the row on hover */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-[2px] w-0 bg-accent transition-[width] duration-500 ease-out group-hover:w-24"
              />

              <div className="self-start md:sticky md:top-24">
                <div className="font-mono text-[13px] text-ink-light">{exp.period}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-mute">
                  {exp.duration}
                  {i === 0 && (
                    <span className="border border-accent/40 px-1.5 py-px font-mono text-[10px] uppercase tracking-wider text-accent">
                      Latest
                    </span>
                  )}
                </div>
              </div>

              <article className="min-w-0">
                <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink-light">{exp.role}</h3>
                  <span className="text-xs uppercase tracking-[0.14em] text-mute">{exp.domain}</span>
                </header>
                <p className="mt-1 text-[15px] text-body">{exp.company}</p>

                <ul className="mt-5 space-y-2.5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[15px] leading-relaxed text-body">
                      <span aria-hidden="true" className="mt-[10px] h-1 w-1 shrink-0 bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {exp.tags.map((tag) => (
                    <li key={tag} className="border border-hairline px-2 py-0.5 font-mono text-[11px] text-body">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
