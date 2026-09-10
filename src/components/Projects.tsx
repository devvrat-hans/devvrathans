"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Project {
  name: string;
  description: string;
  highlights: string[];
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    name: "YourCode",
    description: "Terminal-native autonomous AI coding agent with client-side tool execution, zero remote code exposure, and enterprise AI governance guardrails.",
    highlights: [
      "Client-side distributed tool runtime with strict CWD path confinement",
      "Bun, React 19, OpenTUI, Hono, Prisma ORM, Clerk PKCE & Polar metering",
      "Enterprise AI governance: PII redaction, prompt injection defense & zero-knowledge encryption",
    ],
    tags: ["Bun", "React 19", "OpenTUI", "AI Agents", "AI Governance", "Prisma"],
    github: "https://github.com/devvrat-hans/yourcode",
    link: "https://yourcode.space",
    featured: true,
  },
  {
    name: "BlindDrop",
    description: "Privacy-focused anonymous file-transfer system with one-time download codes and auto-expiry.",
    highlights: [
      "Hash-based horizontal sharding across 3 SQLite databases",
      "SHA-256 integrity checks, UUID storage, rate limiting",
      "Supports files up to 100MB with full audit logging",
    ],
    tags: ["Next.js", "Flask", "SQLite", "Security"],
    github: "https://github.com/devvrat-hans/CS-432-2026/tree/main/blinddrop",
    featured: true,
  },
  {
    name: "Algorithmic Trading Bot",
    description: "Python-based algorithmic trading bot for live trading on the Upstox API with modular architecture.",
    highlights: [
      "Modular design: market data, strategy, execution, risk controls",
      "Stop-loss, take-profit, and automated Upstox API order execution",
      "Real-time options and equities algorithmic trade management",
    ],
    tags: ["Python", "Trading", "API", "Finance"],
    github: "https://github.com/devvrat-hans/algo-trading-bot",
    featured: true,
  },
  {
    name: "ControlPlane AI",
    description: "Real-time AI governance proxy inspecting model calls in <10ms across cost, performance, and responsibility. Built for Accenture Innovation Challenge 2026 (Team Leader).",
    highlights: [
      "Team Leader for Accenture Innovation Challenge 2026 (Problem Statement 1: Reinvent with AI)",
      "Sub-10ms fast path for regex/entropy secret detection, cost caps, and session risk",
      "Async shadow path with 13 automated checks (DeepEval, Presidio, LLM Guard) & fail-open guarantee",
    ],
    tags: ["Rust", "Next.js", "AI Governance", "Docker", "Accenture Challenge"],
    github: "https://github.com/devvrat-hans/controlplane-ai",
    featured: true,
  },
  {
    name: "Adani FinTell Suite",
    description: "AI-powered enterprise financial intelligence & invoice compliance platform with multi-stage GST validation. Built for Adani Finnovate Hackathon 2025 (Team Leader, Runners Up).",
    highlights: [
      "Team Leader & Runners Up at Adani Finnovate Hackathon 2025",
      "AI-powered OCR (80%+ accuracy) with 3-way PO matching and real-time GST portal validation",
      "Automated duplicate detection, price anomaly benchmarks, and conversational analytics chatbot",
    ],
    tags: ["Python", "Gemini AI", "OCR", "FinTech", "Adani Hackathon", "Runner-Up"],
    github: "https://github.com/devvrat-hans/adani-fintell-suite",
    featured: true,
  },
  {
    name: "QRliee",
    description: "QR-powered platform for event check-ins, digital menus, business cards, and building directories with real-time analytics.",
    highlights: [
      "Handled 7,000+ scans at Bharat Innovate with AI-powered Excel import",
      "4 core products - events, menus, business cards, building directories",
      "Smart QR codes with live updates, no reprinting needed",
    ],
    tags: ["Full Stack", "AI/ML", "QR Codes", "Analytics"],
    link: "https://qrliee.com",
  },
  {
    name: "ToonifyIt",
    description: "LLM developer tool converting JSON to TOON (Token-Oriented Object Notation) for token-efficient data representation.",
    highlights: [
      "Real-time browser-based conversion engine",
      "Client-side processing - zero data leaves your device",
      "Configurable delimiters, length markers, token-count comparison",
    ],
    tags: ["Next.js", "TypeScript", "LLM Tools"],
    link: "https://toonifyit.com",
  },
  {
    name: "Vardhaman Agencies",
    description: "B2B/B2C website for a packaging-solutions business serving customers across India.",
    highlights: [
      "Product-focused interfaces with search and quotation workflows",
      "Modular React.js components with mobile-friendly layouts",
    ],
    tags: ["React.js", "B2B", "E-Commerce"],
    link: "https://vardhamanagencies.in",
  },
  {
    name: "Boeing BUILD 2026",
    description: "Official Boeing BUILD 2026 India website - program information, event details, and application workflows.",
    highlights: [
      "End-to-end delivery from stakeholder requirements to production",
      "Responsive across desktop and mobile",
    ],
    tags: ["Web Dev", "Responsive", "Stakeholder Management"],
    link: "https://build.boeing.com",
  },
  {
    name: "IITGN Research Park Website",
    description: "Official website for IIT Gandhinagar Research Park - industry-academia collaboration ecosystem.",
    highlights: [
      "Responsive interfaces for partnerships, labs, and events",
      "Focus on institutional branding and performance",
    ],
    tags: ["Next.js", "SSR", "Institutional"],
    link: "https://iitgnrp.com",
  },
  {
    name: "Zero Waste Gujarat",
    description: "Website for a textile waste-to-value initiative - recycling, sustainable nonwovens, and carbon-credit solutions.",
    highlights: [
      "Built with Next.js + SSR for SEO and performance",
      "Communicates sustainability initiatives effectively",
    ],
    tags: ["Next.js", "SSR", "Sustainability"],
    link: "https://zerowastegujarat.com",
  },
  {
    name: "Chess Website - IITGN",
    description: "Official web platform for the IIT Gandhinagar chess community.",
    highlights: [
      "Event listings, competition registration, gallery management",
      "Interactive forms and dynamic event updates",
    ],
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/devvrat-hans/Chess-IITGN",
  },
  {
    name: "Poetic Text Generator",
    description: "RNN-based LSTM text-generation model for producing poetic text from sequential training data.",
    highlights: [
      "Character-level tokenization and sequence modeling",
      "Temperature-controlled sampling for varied outputs",
    ],
    tags: ["Python", "RNN", "LSTM", "NLP"],
    github: "https://github.com/devvrat-hans/Poetic-Text-Generator-using-RNN",
  },
  {
    name: "Plant Disease Detection",
    description: "CNN-based multi-class image classification system for detecting plant diseases from leaf images.",
    highlights: [
      "Trained on PlantVillage dataset with TensorFlow/Keras",
      "Multi-class disease identification pipeline",
    ],
    tags: ["Python", "CNN", "TensorFlow", "Computer Vision"],
    github: "https://github.com/devvrat-hans/Plant-Disease-Detection",
  },
  {
    name: "Handwritten Digit Generator",
    description: "Deep Convolutional GAN for generating realistic handwritten digit images from noise.",
    highlights: [
      "Generator + discriminator architecture with TensorFlow/Keras",
      "Trained on MNIST with progressive image synthesis",
    ],
    tags: ["Python", "GAN", "TensorFlow", "Deep Learning"],
    github: "https://github.com/devvrat-hans/Generating-Handwritten-Digit-Images",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-accent-violet tracking-wide uppercase">
            // projects
          </span>
          <h2 className="mt-3 text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
            Things I&apos;ve built.
          </h2>
          <p className="mt-5 max-w-2xl text-[17px] text-body leading-[1.65]">
            A selection of projects spanning full-stack development, AI/ML, security,
            and developer tools - from production websites to open-source contributions.
          </p>
        </motion.div>

        {/* Featured projects - card-marketing with Level 3 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-14 grid sm:grid-cols-2 gap-4"
        >
          {projects.filter(p => p.featured).map((project, index) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`group rounded-xl border border-hairline bg-canvas-soft p-6 card-elevated flex flex-col ${
                index === 4 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-accent-amber" />
                  <h3 className="text-base font-medium text-ink-light">
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mute hover:text-ink-light transition-colors"
                    >
                      <GithubIcon size={14} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mute hover:text-ink-light transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-body leading-relaxed flex-1">
                {project.description}
              </p>

              <ul className="mt-3 space-y-1">
                {project.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="text-xs text-mute flex items-start gap-1.5">
                    <span className="text-accent-cyan mt-0.5">▸</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-canvas border border-hairline px-2 py-0.5 text-[10px] font-mono text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other projects - smaller cards with Level 2 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-8 grid sm:grid-cols-2 gap-3"
        >
          {projects.filter(p => !p.featured).map((project) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="group rounded-lg border border-hairline bg-canvas-soft/50 p-4 card-elevated"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-ink-light">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mute hover:text-ink-light transition-colors"
                    >
                      <GithubIcon size={12} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mute hover:text-ink-light transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-xs text-body leading-relaxed">
                {project.description}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-canvas border border-hairline px-2 py-0.5 text-[10px] font-mono text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
