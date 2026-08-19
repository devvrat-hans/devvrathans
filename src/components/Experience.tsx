"use client";

import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  tags: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    company: "Intentyfi",
    period: "Feb '26 - Jul '26",
    highlights: [
      "Architected Case Management Application from scratch using Rust, Axum, PostgreSQL, Next.js - enabling case monitoring, reviewer workflows, and HITL oversight.",
      "Built production RAG infrastructure covering document extraction, configurable chunking, Gemini embeddings, and similarity retrieval.",
      "Implemented AI governance & evaluation controls - PII masking, prompt-injection detection, AST-based SQL validation, and BYOK credential management.",
      "Developed LLM orchestration systems with Python, FastAPI, Google ADK, and Gemini - including schema grounding, context compression, and async BI execution.",
    ],
    tags: ["Rust", "Axum", "PostgreSQL", "Next.js", "Python", "FastAPI", "GCP"],
  },
  {
    role: "Founder's Office - Technology",
    company: "Aback.ai",
    period: "Jun '25 - Feb '26",
    highlights: [
      "Led technology across software architecture, AI integration, workflow automation, backend, frontend, and cloud deployment.",
      "Built and launched AbackTools.com - AI-powered tools platform attracting ~500 clicks/day.",
      "Contributed to QRliee, Invoice Management, Inventory Management, and AI Recruitment Portal products.",
    ],
    tags: ["Full Stack", "AI/ML", "Product", "Cloud"],
  },
  {
    role: "Development Intern",
    company: "Trado (Windigo Trade)",
    period: "Nov '25 - Jan '26",
    highlights: [
      "Developed algorithmic trading platform using LEAN engine, adapting architecture to company-specific infrastructure.",
      "Built end-to-end pipeline for historical backtesting and live algorithmic trading.",
      "Solely led development of Connect by Trado from scratch.",
    ],
    tags: ["Python", "LEAN", "Trading", "API"],
  },
  {
    role: "Development Intern",
    company: "Curlsek AI Technologies",
    period: "Mar '25 - Jul '25",
    highlights: [
      "Built core PoC for AI-powered cybersecurity portal - AI agents detecting SQL injection and automated security testing.",
      "Designed secure auth APIs using Spring Boot and MongoDB with RBAC and session management.",
    ],
    tags: ["Spring Boot", "MongoDB", "Security", "AI"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-accent-pink tracking-wide uppercase">
            // experience
          </span>
          <h2 className="mt-3 text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
            Where I&apos;ve worked.
          </h2>
        </motion.div>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="absolute left-0 sm:left-4 top-0 bottom-0 w-px bg-hairline" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="space-y-6"
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.company}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="relative pl-6 sm:pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 sm:left-4 top-6 w-2 h-2 rounded-full bg-accent-cyan -translate-x-[3.5px] sm:-translate-x-[3.5px]" />

                {/* Experience card - card-marketing with Level 2 shadow */}
                <div className="rounded-xl border border-hairline bg-canvas p-6 card-elevated">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-base font-medium text-ink-light">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 size={12} className="text-mute" />
                        <span className="text-sm text-body">{exp.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-mute font-mono">
                      <Calendar size={11} />
                      {exp.period}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-body leading-relaxed">
                        <span className="text-accent-cyan mt-1 text-xs shrink-0">▸</span>
                        <span dangerouslySetInnerHTML={{
                          __html: h.replace(/\*\*(.*?)\*\*/g, '<span class="text-ink-light font-medium">$1</span>')
                        }} />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-canvas-soft border border-hairline px-2.5 py-0.5 text-[11px] font-mono text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
