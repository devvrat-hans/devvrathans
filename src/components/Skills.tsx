"use client";

import { motion } from "framer-motion";

interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    color: "text-accent-cyan",
    skills: ["Python", "C", "C++", "Java", "Rust", "SQL", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    name: "Frameworks & Libraries",
    color: "text-accent-pink",
    skills: ["React.js", "Next.js", "Angular", "RxJS", "Spring Boot", "FastAPI", "Axum", "Flask", "TensorFlow", "Keras"],
  },
  {
    name: "AI / ML / LLM",
    color: "text-accent-violet",
    skills: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "LLMs", "RAG", "Agentic AI", "AI Governance & Evaluation", "Prompt Engineering", "Gemini", "Vector Retrieval", "Google ADK"],
  },
  {
    name: "Databases & ORMs",
    color: "text-accent-amber",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "SQLx", "Prisma"],
  },
  {
    name: "Cloud & Infrastructure",
    color: "text-accent-blue",
    skills: ["GCP", "Cloud Run", "Cloud Build", "Cloud SQL", "Vertex AI", "Docker", "GCP IAM"],
  },
  {
    name: "Security & Systems",
    color: "text-accent-cyan",
    skills: ["Auth/RBAC", "PII Masking", "Prompt Injection Detection", "SQL AST Validation", "REST APIs", "Microservices", "SSE"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-accent-amber tracking-wide uppercase">
            // skills
          </span>
          <h2 className="mt-3 text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
            My tech stack.
          </h2>
        </motion.div>

        {/* Skill categories - card-marketing with Level 2 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {skillCategories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-hairline bg-canvas p-5 card-elevated"
            >
              <h3 className={`text-xs font-mono uppercase tracking-wider ${cat.color} mb-3`}>
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-canvas-soft border border-hairline px-2.5 py-1 text-xs text-body hover:text-ink-light hover:border-hairline-strong transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Competitive programming & chess - card-marketing with Level 2 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-6 grid sm:grid-cols-2 gap-4"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-hairline bg-canvas p-5 card-elevated"
          >
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-pink mb-3">
              Competitive Programming
            </h3>
            <div className="space-y-2 text-sm text-body">
              <div className="flex justify-between">
                <span>Codeforces</span>
                <span className="font-mono text-ink-light">1200+</span>
              </div>
              <div className="flex justify-between">
                <span>Leetcode</span>
                <span className="font-mono text-ink-light">1500+</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-hairline bg-canvas p-5 card-elevated"
          >
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-cyan mb-3">
              Chess
            </h3>
            <div className="space-y-2 text-sm text-body">
              <div className="flex justify-between">
                <span>FIDE Rating (Rapid)</span>
                <span className="font-mono text-ink-light">1437</span>
              </div>
              <div className="flex justify-between">
                <span>Chess.com Peak (Rapid)</span>
                <span className="font-mono text-ink-light">1938</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
