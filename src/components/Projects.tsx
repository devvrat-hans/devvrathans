"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, ChartCandlestick, ChevronDown, Lock, Receipt, ShieldCheck, SquareTerminal, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GithubIcon } from "./icons";
import { SectionHeader, fadeUp, stagger, trackSpotlight } from "./Section";

type Category = "ai" | "web" | "ml" | "systems";

type Tone = "prompt" | "cmd" | "ok" | "mute" | "accent" | "warn" | "text";
/** A tiny illustrative window (terminal / log) rendered at the top of large featured cards. */
interface Preview {
  title: string;
  lines: [Tone, string][][];
}

interface Project {
  name: string;
  description: string;
  highlights: string[];
  tags: string[];
  categories: Category[];
  link?: string;
  github?: string;
  featured?: boolean;
  /** Short award label shown as a badge on the card */
  award?: string;
  icon?: LucideIcon;
  preview?: Preview;
}

const TONE: Record<Tone, string> = {
  prompt: "text-accent",
  cmd: "text-ink-light",
  ok: "text-ink-light",
  mute: "text-mute",
  accent: "text-ink-light",
  warn: "text-mute",
  text: "text-body",
};

const projects: Project[] = [
  {
    name: "YourCode",
    description:
      "Terminal-native autonomous AI coding agent with client-side tool execution, zero remote code exposure, and enterprise AI governance guardrails.",
    highlights: [
      "Client-side distributed tool runtime with strict CWD path confinement",
      "Bun, React 19, OpenTUI, Hono, Prisma ORM, Clerk PKCE & Polar metering",
      "Enterprise AI governance: PII redaction, prompt injection defense & zero-knowledge encryption",
    ],
    tags: ["Bun", "React 19", "OpenTUI", "AI Agents", "AI Governance", "Prisma"],
    categories: ["ai", "systems"],
    github: "https://github.com/devvrat-hans/yourcode",
    link: "https://yourcode.space",
    featured: true,
    icon: SquareTerminal,
    preview: {
      title: "yourcode · zsh",
      lines: [
        [["prompt", "~/app $ "], ["cmd", 'yourcode "add rate limiting to /login"']],
        [["mute", "  ▸ read  "], ["accent", "src/routes/login.ts"]],
        [["mute", "  ▸ edit  "], ["accent", "src/routes/login.ts"], ["ok", "  +18"], ["warn", " -3"]],
        [["ok", "  ✓ "], ["mute", "ran locally · cwd confined · PII redacted"]],
      ],
    },
  },
  {
    name: "ControlPlane AI",
    description:
      "Real-time AI governance proxy inspecting model calls in <10ms across cost, performance, and responsibility.",
    highlights: [
      "Team Leader, National Top 10 of 3,000+ teams at the Accenture Innovation Challenge 2026, securing a PPO",
      "Sub-10ms fast path for regex/entropy secret detection, cost caps, and session risk",
      "Async shadow path with 13 automated checks (DeepEval, Presidio, LLM Guard) & fail-open guarantee",
    ],
    tags: ["Rust", "Next.js", "AI Governance", "Docker"],
    categories: ["ai", "systems"],
    github: "https://github.com/devvrat-hans/controlplane-ai",
    featured: true,
    award: "Accenture · National Top 10 & PPO",
    icon: ShieldCheck,
    preview: {
      title: "controlplane · proxy.log",
      lines: [
        [["accent", "POST "], ["cmd", "/v1/chat/completions"]],
        [["mute", "  fast    "], ["ok", "✓ secrets  ✓ cost cap  ✓ risk"], ["accent", "  <10ms"]],
        [["mute", "  shadow  "], ["text", "13 checks"], ["mute", " · DeepEval · Presidio"]],
        [["ok", "  → forwarded "], ["mute", "(fail-open)"]],
      ],
    },
  },
  {
    name: "Adani FinTell Suite",
    description:
      "AI-powered enterprise financial intelligence & invoice compliance platform with multi-stage GST validation.",
    highlights: [
      "Team Leader & Runner-Up at Adani Finnovate Hackathon 2025",
      "AI-powered OCR (80%+ accuracy) with 3-way PO matching and real-time GST portal validation",
      "Automated duplicate detection, price anomaly benchmarks, and conversational analytics chatbot",
    ],
    tags: ["Python", "Gemini AI", "OCR", "FinTech"],
    categories: ["ai", "systems"],
    github: "https://github.com/devvrat-hans/adani-fintell-suite",
    featured: true,
    award: "Adani Finnovate · Runner-Up",
    icon: Receipt,
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
    categories: ["systems", "web"],
    github: "https://github.com/devvrat-hans/CS-432-2026/tree/main/blinddrop",
    featured: true,
    icon: Lock,
  },
  {
    name: "Algorithmic Trading Bot",
    description: "Python-based algorithmic trading bot for live trading on the Upstox API with a modular architecture.",
    highlights: [
      "Modular design: market data, strategy, execution, risk controls",
      "Stop-loss, take-profit, and automated Upstox API order execution",
      "Real-time options and equities algorithmic trade management",
    ],
    tags: ["Python", "Trading", "API", "Finance"],
    categories: ["systems"],
    github: "https://github.com/devvrat-hans/algo-trading-bot",
    featured: true,
    icon: ChartCandlestick,
  },
  {
    name: "QRliee",
    description:
      "QR-powered platform for event check-ins, digital menus, business cards, and building directories with real-time analytics.",
    highlights: [
      "Handled 7,000+ scans at Bharat Innovate with AI-powered Excel import",
      "4 core products: events, menus, business cards, building directories",
      "Smart QR codes with live updates, no reprinting needed",
    ],
    tags: ["Full Stack", "AI/ML", "QR Codes", "Analytics"],
    categories: ["web", "ai"],
    link: "https://qrliee.com",
  },
  {
    name: "ToonifyIt",
    description:
      "LLM developer tool converting JSON to TOON (Token-Oriented Object Notation) for token-efficient data representation.",
    highlights: [
      "Real-time browser-based conversion engine",
      "Client-side processing: zero data leaves your device",
      "Configurable delimiters, length markers, token-count comparison",
    ],
    tags: ["Next.js", "TypeScript", "LLM Tools"],
    categories: ["ai", "web"],
    link: "https://toonifyit.com",
  },
  {
    name: "Boeing BUILD 2026",
    description: "Official Boeing BUILD 2026 India website with program information, event details, and application workflows.",
    highlights: ["End-to-end delivery from stakeholder requirements to production", "Responsive across desktop and mobile"],
    tags: ["Web Dev", "Responsive", "Stakeholder Management"],
    categories: ["web"],
    link: "https://iieciitgn.com/build2026/",
  },
  {
    name: "IITGN Research Park",
    description: "Official website for IIT Gandhinagar Research Park, an industry-academia collaboration ecosystem.",
    highlights: ["Responsive interfaces for partnerships, labs, and events", "Focus on institutional branding and performance"],
    tags: ["Next.js", "SSR", "Institutional"],
    categories: ["web"],
    link: "https://iitgnrp.com",
  },
  {
    name: "Zero Waste Gujarat",
    description: "Website for a textile waste-to-value initiative: recycling, sustainable nonwovens, and carbon-credit solutions.",
    highlights: ["Built with Next.js + SSR for SEO and performance", "Communicates sustainability initiatives effectively"],
    tags: ["Next.js", "SSR", "Sustainability"],
    categories: ["web"],
    link: "https://zerowastegujarat.com",
  },
  {
    name: "Vardhaman Agencies",
    description: "B2B/B2C website for a packaging-solutions business serving customers across India.",
    highlights: ["Product-focused interfaces with search and quotation workflows", "Modular React.js components with mobile-friendly layouts"],
    tags: ["React.js", "B2B", "E-Commerce"],
    categories: ["web"],
    link: "https://vardhamanagencies.in",
  },
  {
    name: "IITGN Chess Website",
    description: "Official web platform for the IIT Gandhinagar chess community.",
    highlights: ["Event listings, competition registration, gallery management", "Interactive forms and dynamic event updates"],
    tags: ["HTML", "CSS", "JavaScript"],
    categories: ["web"],
    github: "https://github.com/devvrat-hans/Chess-IITGN",
  },
  {
    name: "Poetic Text Generator",
    description: "RNN-based LSTM text-generation model for producing poetic text from sequential training data.",
    highlights: ["Character-level tokenization and sequence modeling", "Temperature-controlled sampling for varied outputs"],
    tags: ["Python", "RNN", "LSTM", "NLP"],
    categories: ["ml"],
    github: "https://github.com/devvrat-hans/Poetic-Text-Generator-using-RNN",
  },
  {
    name: "Plant Disease Detection",
    description: "CNN-based multi-class image classification system for detecting plant diseases from leaf images.",
    highlights: ["Trained on PlantVillage dataset with TensorFlow/Keras", "Multi-class disease identification pipeline"],
    tags: ["Python", "CNN", "TensorFlow", "Computer Vision"],
    categories: ["ml"],
    github: "https://github.com/devvrat-hans/Plant-Disease-Detection",
  },
  {
    name: "Handwritten Digit Generator",
    description: "Deep Convolutional GAN for generating realistic handwritten digit images from noise.",
    highlights: ["Generator + discriminator architecture with TensorFlow/Keras", "Trained on MNIST with progressive image synthesis"],
    tags: ["Python", "GAN", "TensorFlow", "Deep Learning"],
    categories: ["ml"],
    github: "https://github.com/devvrat-hans/Generating-Handwritten-Digit-Images",
  },
];

const FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & Agents" },
  { id: "systems", label: "Systems & FinTech" },
  { id: "web", label: "Web" },
  { id: "ml", label: "Machine Learning" },
];

const COLLAPSED_COUNT = 6;

// "https://iieciitgn.com/build2026/" → "iieciitgn.com/build2026": drop the scheme and trailing slash, keep any path.
const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function Projects() {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) for (const cat of p.categories) c[cat] = (c[cat] ?? 0) + 1;
    return c;
  }, []);

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const filtered = filter === "all" ? [] : projects.filter((p) => p.categories.includes(filter));
  const visibleOthers = expanded ? others : others.slice(0, COLLAPSED_COUNT);

  return (
    <section id="projects" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="03"
          eyebrow="Projects"
          title="Things I've built."
          description="A selection spanning AI governance, agents, security, fintech, and production websites for real clients."
          aside={
            <a
              href="https://github.com/devvrat-hans"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              <GithubIcon size={14} />
              All repositories
              <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          }
        />

        {/* Filter: square segmented control */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="no-scrollbar -mx-6 mt-12 overflow-x-auto px-6"
        >
          <div role="tablist" aria-label="Filter projects" className="inline-flex border border-hairline">
            <LayoutGroup id="project-filters">
              {FILTERS.map((f, i) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.id)}
                    className={`relative whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${
                      i > 0 ? "border-l border-hairline" : ""
                    } ${active ? "text-on-primary" : "text-body hover:bg-canvas-soft hover:text-ink-light"}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-filter-pill"
                        className="absolute inset-0 bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">
                      {f.label}
                      <span className={`ml-2 font-mono text-[10px] ${active ? "opacity-60" : "text-mute"}`}>
                        {String(counts[f.id] ?? 0).padStart(2, "0")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filter === "all" ? (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Featured: a cell grid; 1px gaps over a hairline background give shared, crisp borders */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger(0.08)}
                className="mt-8 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-6"
              >
                {featured.map((p, i) => (
                  <FeaturedCard key={p.name} project={p} className={i < 2 ? "lg:col-span-3" : "md:last:col-span-2 lg:col-span-2 lg:last:col-span-2"} large={i < 2} />
                ))}
              </motion.div>

              {/* More projects */}
              <div className="mt-20 flex items-baseline justify-between gap-4 border-b border-hairline-strong pb-4">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink-light">More projects</h3>
                <span className="font-mono text-xs text-mute">{String(others.length).padStart(2, "0")} entries</span>
              </div>
              <motion.ul layout className="divide-y divide-hairline">
                <AnimatePresence initial={false}>
                  {visibleOthers.map((p, i) => (
                    <ProjectRow key={p.name} project={p} index={i + 1} />
                  ))}
                </AnimatePresence>
              </motion.ul>
              {others.length > COLLAPSED_COUNT && (
                <div className="border-t border-hairline pt-8">
                  <button
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                    className="inline-flex h-11 items-center gap-2 border border-hairline-strong px-5 text-sm font-medium text-ink-light transition-colors hover:border-ink-light cursor-pointer"
                  >
                    {expanded ? "Show fewer" : `Show all ${others.length} projects`}
                    <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Separate bordered cells here: result counts vary, so a shared-border grid could leave holes */}
              {filtered.map((p) => (
                <FeaturedCard key={p.name} project={p} animate={false} className="border border-hairline hover:border-hairline-strong" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectLinks({ project, size = 14 }: { project: Project; size?: number }) {
  return (
    <div className="relative z-10 flex items-center gap-0.5">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} source on GitHub`}
          className="flex h-8 w-8 items-center justify-center text-mute transition-colors hover:bg-canvas-soft-2 hover:text-ink-light"
        >
          <GithubIcon size={size} />
        </a>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${project.name} live site`}
          className="flex h-8 w-8 items-center justify-center text-mute transition-colors hover:bg-canvas-soft-2 hover:text-accent"
        >
          <ArrowUpRight size={size + 2} />
        </a>
      )}
    </div>
  );
}

/** Stretched-link classes: the whole card is clickable while the icon links stay on top. */
const stretched =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent";

function FeaturedCard({
  project,
  className = "",
  large = false,
  animate = true,
}: {
  project: Project;
  className?: string;
  large?: boolean;
  animate?: boolean;
}) {
  const primary = project.link ?? project.github;
  const showPreview = Boolean(large && project.preview);
  const Icon = project.icon;

  return (
    <motion.article
      variants={animate ? fadeUp : undefined}
      transition={{ duration: 0.45 }}
      onPointerMove={trackSpotlight}
      className={`spotlight card-hover group relative flex flex-col bg-canvas p-6 transition-colors hover:bg-canvas-soft sm:p-7 ${className}`}
    >
      {showPreview && <PreviewWindow preview={project.preview!} />}

      {!showPreview && Icon && (
        <span
          aria-hidden="true"
          className="mb-6 flex h-10 w-10 shrink-0 items-center justify-center border border-hairline text-body transition-colors group-hover:border-hairline-strong group-hover:text-accent"
        >
          <Icon size={17} />
        </span>
      )}

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {project.award && (
            <span className="mb-3 inline-flex items-center gap-1.5 border border-accent/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
              <Trophy size={10} aria-hidden="true" />
              {project.award}
            </span>
          )}
          <h3 className={`${large ? "text-2xl" : "text-xl"} font-semibold tracking-[-0.025em] text-ink-light`}>
            {primary ? (
              <a href={primary} target="_blank" rel="noopener noreferrer" className={stretched}>
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </h3>
          {project.link && <p className="mt-1 font-mono text-[11px] text-mute">{displayUrl(project.link)}</p>}
        </div>
        <ProjectLinks project={project} />
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-body">{project.description}</p>

      <ul className="mt-5 space-y-2">
        {project.highlights.slice(0, large ? 3 : 2).map((h) => (
          <li key={h} className="flex items-start gap-3 text-[13px] leading-relaxed text-mute">
            <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 bg-accent" />
            {h}
          </li>
        ))}
      </ul>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Technologies">
        {project.tags.map((tag) => (
          <li key={tag} className="border border-hairline px-2 py-0.5 font-mono text-[10px] text-body">
            {tag}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function PreviewWindow({ preview }: { preview: Preview }) {
  return (
    <div
      aria-hidden="true"
      className="relative mb-7 overflow-hidden border border-hairline bg-canvas-soft font-mono text-[11px] leading-[1.9] transition-colors group-hover:border-hairline-strong sm:text-xs"
    >
      <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2">
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="ml-2 truncate text-[10px] text-mute">{preview.title}</span>
      </div>
      <div className="px-4 py-3">
        {preview.lines.map((segments, i) => (
          <div key={i} className="overflow-hidden text-ellipsis whitespace-pre">
            {segments.map(([tone, text], j) => (
              <span key={j} className={TONE[tone]}>
                {text}
              </span>
            ))}
            {i === preview.lines.length - 1 && (
              <span className="terminal-cursor ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
            )}
          </div>
        ))}
      </div>
      {/* Soft fade on the right edge so clipped lines don't end abruptly */}
      <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas-soft to-transparent" />
    </div>
  );
}

/** Compact ruled row for the secondary project list. */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primary = project.link ?? project.github;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 py-5 transition-colors hover:bg-canvas-soft sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-center sm:px-2"
    >
      <span className="pt-0.5 font-mono text-xs text-mute sm:pt-0">{String(index).padStart(2, "0")}</span>
      <div className="min-w-0">
        <h4 className="text-[15px] font-semibold text-ink-light transition-colors group-hover:text-accent">
          {primary ? (
            <a href={primary} target="_blank" rel="noopener noreferrer" className={stretched}>
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h4>
        <p className="mt-0.5 truncate font-mono text-[11px] text-mute">
          {project.link ? displayUrl(project.link) : "github.com/devvrat-hans"}
        </p>
      </div>
      <div className="col-start-2 min-w-0 sm:col-start-auto">
        <p className="text-sm leading-relaxed text-body">{project.description}</p>
        <p className="mt-1.5 font-mono text-[10px] text-mute">{project.tags.join(" · ")}</p>
      </div>
      <div className="col-start-3 row-start-1 sm:col-start-auto sm:row-start-auto">
        <ProjectLinks project={project} size={13} />
      </div>
    </motion.li>
  );
}
