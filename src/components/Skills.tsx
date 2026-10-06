"use client";

import { motion } from "framer-motion";
import { Braces, Boxes, Brain, Database, Cloud, ShieldCheck, Swords, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CountUp, SectionHeader, fadeUp, stagger } from "./Section";

interface SkillCategory {
  name: string;
  icon: LucideIcon;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: Braces,
    skills: ["Python", "TypeScript", "Rust", "JavaScript", "Java", "C++", "C", "SQL", "HTML", "CSS"],
  },
  {
    name: "Frameworks & Libraries",
    icon: Boxes,
    skills: ["React.js", "Next.js", "FastAPI", "Axum", "Spring Boot", "Angular", "RxJS", "Flask", "TensorFlow", "Keras"],
  },
  {
    name: "AI / ML / LLM",
    icon: Brain,
    skills: ["Agentic AI", "AI Governance & Evaluation", "LLMs", "RAG", "Google ADK", "Gemini", "Vector Retrieval", "Prompt Engineering", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
  },
  {
    name: "Databases & ORMs",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "MySQL", "SQLx", "Prisma"],
  },
  {
    name: "Cloud & Infrastructure",
    icon: Cloud,
    skills: ["GCP", "Cloud Run", "Cloud Build", "Cloud SQL", "Vertex AI", "Docker", "GCP IAM"],
  },
  {
    name: "Security & Systems",
    icon: ShieldCheck,
    skills: ["Auth/RBAC", "PII Masking", "Prompt Injection Detection", "SQL AST Validation", "REST APIs", "Microservices", "SSE"],
  },
];

const beyond = [
  {
    title: "Competitive Programming",
    icon: Swords,
    rows: [
      { label: "Codeforces", value: "1200+" },
      { label: "LeetCode", value: "1500+" },
    ],
  },
  {
    title: "Chess",
    icon: Crown,
    rows: [
      { label: "FIDE Rating (Rapid)", value: "1437" },
      { label: "Chess.com Peak (Rapid)", value: "1938" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="04"
          eyebrow="Skills"
          title="My tech stack."
          description="The tools I reach for most, from systems languages to LLM orchestration and cloud infrastructure."
        />

        {/* Ruled table: one row per category */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.06)}
          className="mt-14 border-t border-hairline-strong"
        >
          {skillCategories.map((cat, i) => (
            <motion.li
              key={cat.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="group relative grid grid-cols-1 gap-4 border-b border-hairline py-6 transition-colors hover:bg-canvas-soft md:grid-cols-[3rem_15rem_minmax(0,1fr)] md:items-center md:gap-6 md:px-2"
            >
              <span className="hidden font-mono text-xs text-mute md:block" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-3">
                <cat.icon size={16} className="shrink-0 text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
                <h3 className="text-[15px] font-semibold text-ink-light">{cat.name}</h3>
                <span className="ml-auto font-mono text-[11px] text-mute md:ml-1">{cat.skills.length}</span>
              </div>
              <ul className="flex flex-wrap gap-1.5" aria-label={cat.name}>
                {cat.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-hairline bg-canvas px-2.5 py-1 text-[13px] text-body transition-colors hover:border-ink-light hover:text-ink-light"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-20 flex items-baseline justify-between gap-4 border-b border-hairline-strong pb-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink-light">Beyond code</h3>
          <span className="text-xs uppercase tracking-[0.14em] text-mute">Ratings</span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.1)}
          className="grid grid-cols-1 sm:grid-cols-2"
        >
          {beyond.map((b, i) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`border-b border-hairline py-7 sm:px-6 ${i === 0 ? "sm:border-r sm:pl-0" : "sm:pr-0"}`}
            >
              <div className="flex items-center gap-2 text-[13px] text-body">
                <b.icon size={14} className="text-mute" aria-hidden="true" />
                {b.title}
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-6">
                {b.rows.map((r) => (
                  <div key={r.label} className="flex flex-col-reverse">
                    <dt className="mt-1.5 text-xs text-mute">{r.label}</dt>
                    <dd className="text-3xl font-semibold tracking-[-0.03em] text-ink-light">
                      <CountUp value={r.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
