"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Download,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
} from "lucide-react";

type DocType = "resume" | "cv";

interface DocInfo {
  id: DocType;
  label: string;
  badge: string;
  pages: string;
  size: string;
  filename: string;
  downloadName: string;
  tagline: string;
  description: string;
  bestFor: string;
  highlights: string[];
}

const DOCS: Record<DocType, DocInfo> = {
  resume: {
    id: "resume",
    label: "1-Page Resume",
    badge: "Industry / SWE",
    pages: "1 Page",
    size: "76 KB",
    filename: "/resume.pdf",
    downloadName: "Devvrat_Hans_Resume.pdf",
    tagline: "Distilled single-page overview for technical recruiting and engineering teams.",
    description:
      "Concise single-page format highlighting production engineering, agentic AI, system architecture, and core credentials.",
    bestFor: "Tech Recruiters, SWE / AI Engineering Roles, Fast Review",
    highlights: [
      "B.Tech CSE at IIT Gandhinagar (CPI: 8.30, AIR 1505 JEE Adv, 99.65%ile JEE Main)",
      "Software Engineering Intern at Intentyfi (Rust, Axum, RAG, Case Management App, HITL)",
      "Founder's Office at Aback.ai (AbackTools.com ~500 DAU, AI Recruitment, Invoice ERP)",
      "Accenture Innovation Challenge '26 Team Leader (ControlPlane.ai <10ms Rust proxy)",
      "Adani Finnovate Hackathon '25 Runner-Up (Gemini AI Invoice & Compliance Platform)",
      "YourCode (Open-Source Terminal Coding Agent & Local Execution Engine)",
    ],
  },
  cv: {
    id: "cv",
    label: "5-Page Master CV",
    badge: "Comprehensive / Academic",
    pages: "5 Pages",
    size: "127 KB",
    filename: "/cv.pdf",
    downloadName: "Devvrat_Hans_CV.pdf",
    tagline: "Unabridged CDS-format academic and professional curriculum vitae.",
    description:
      "Complete historical record including all research projects, coursework, multiple internships, extensive project catalog, and leadership positions.",
    bestFor: "Academic Research, R&D Labs, Faculty Review, Deep Background Checks",
    highlights: [
      "All 4 Internships (Intentyfi, Aback.ai, Trado LEAN Trading Engine, Curlsek Cybersecurity AI)",
      "Biomaterials AI Research (Prof. Mukesh Dhanka - RDKit, XGBoost ensembles, pgvector)",
      "Chess Chunking Research (Prof. Krishna Prasad Miyapuram - EMT pause analysis, Stockfish)",
      "6 Technical Projects + 6 Machine Learning Models + 6 Web Systems",
      "Full coursework catalog: 26 CS core, AI/Data Science, Mathematics & Management courses",
      "9 Positions of Responsibility (EII Senior Tech, SAC Webmaster, Amalthea, Tinkerers' Lab)",
    ],
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ResumeViewer() {
  const [activeTab, setActiveTab] = useState<DocType>("resume");
  const doc = DOCS[activeTab];

  return (
    <div className="min-h-screen bg-canvas">
      <main className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Back link */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-mute hover:text-ink-light transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to portfolio</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-hairline"
          >
            <div>
              <span className="font-mono text-xs text-accent-cyan tracking-wide uppercase">
                // credentials
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink-light">
                Resume &amp; Curriculum Vitae.
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] text-body leading-relaxed">
                Choose the <strong>1-Page Resume</strong> for industry and engineering roles, or the{" "}
                <strong>5-Page Master CV</strong> for complete research and academic credentials.
              </p>
            </div>

            {/* Document Switcher Tabs */}
            <div className="inline-flex items-center p-1 rounded-xl border border-hairline bg-canvas-soft shrink-0">
              <button
                onClick={() => setActiveTab("resume")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "resume"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-body hover:text-ink-light hover:bg-canvas-soft-2"
                }`}
              >
                <Briefcase size={14} />
                <span>1-Page Resume</span>
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    activeTab === "resume"
                      ? "border-on-primary/25 bg-on-primary/10 text-on-primary font-semibold"
                      : "border-hairline-strong bg-canvas-soft-2 text-ink-light/80 font-medium"
                  }`}
                >
                  SWE
                </span>
              </button>

              <button
                onClick={() => setActiveTab("cv")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "cv"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-body hover:text-ink-light hover:bg-canvas-soft-2"
                }`}
              >
                <GraduationCap size={14} />
                <span>5-Page Master CV</span>
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    activeTab === "cv"
                      ? "border-on-primary/25 bg-on-primary/10 text-on-primary font-semibold"
                      : "border-hairline-strong bg-canvas-soft-2 text-ink-light/80 font-medium"
                  }`}
                >
                  Academic
                </span>
              </button>
            </div>
          </motion.div>

          {/* Action Toolbar */}
          <motion.div
            key={activeTab + "-bar"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-hairline bg-canvas-soft"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-hairline bg-canvas flex items-center justify-center text-ink-light">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-light">{doc.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-hairline text-mute">
                    {doc.pages} &middot; {doc.size}
                  </span>
                </div>
                <p className="text-xs text-mute mt-0.5">{doc.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <a
                href={doc.filename}
                download={doc.downloadName}
                className="flex items-center gap-1.5 rounded-full bg-primary text-on-primary px-4 py-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={13} />
                <span>Download PDF</span>
              </a>

              <a
                href={doc.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-4 py-2 text-xs sm:text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
            </div>
          </motion.div>

          {/* Embedded Viewer */}
          <div className="mt-6 rounded-2xl border border-hairline overflow-hidden bg-canvas-soft card-elevated">
            <div className="p-3 sm:p-4 border-b border-hairline bg-canvas flex items-center justify-between text-xs text-mute font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                Preview: {doc.downloadName}
              </span>
              <span>Best viewed on desktop &middot; Zoom supported</span>
            </div>

            <div className="w-full h-[75vh] min-h-[600px] max-h-[1000px] bg-[#1a1a1a]">
              <iframe
                src={`${doc.filename}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                title={`${doc.label} - Devvrat Hans`}
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 border-t border-hairline bg-canvas flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mute">
              <span>
                Having trouble previewing?{" "}
                <a
                  href={doc.filename}
                  download={doc.downloadName}
                  className="text-accent-cyan hover:underline font-medium"
                >
                  Click here to download {doc.downloadName}
                </a>
              </span>
              <span className="font-mono text-[11px]">Last updated: September 2026</span>
            </div>
          </div>

          {/* Highlights & Scope Card */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-xl border border-hairline bg-canvas-soft p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan uppercase tracking-wide">
                <Sparkles size={13} />
                <span>What&apos;s covered in this document</span>
              </div>
              <h3 className="mt-2 text-lg font-medium text-ink-light">Key Document Highlights</h3>
              <ul className="mt-4 space-y-2.5">
                {doc.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-body leading-relaxed">
                    <span className="font-mono text-accent-cyan text-xs mt-1">&rarr;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-hairline bg-canvas-soft p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-mute uppercase tracking-wide">
                  <Layers size={13} />
                  <span>Document Scope</span>
                </div>
                <h3 className="mt-2 text-base font-medium text-ink-light">Recommended For</h3>
                <p className="mt-2 text-sm text-body leading-relaxed">{doc.bestFor}</p>

                <div className="mt-6 pt-6 border-t border-hairline">
                  <div className="text-xs font-mono text-mute uppercase">Alternative Document</div>
                  <p className="mt-2 text-xs text-body leading-relaxed">
                    {activeTab === "resume"
                      ? "Looking for complete research papers, all 26 courses, or extracurriculars?"
                      : "Looking for a fast 1-page summary for standard SWE or AI screening?"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(activeTab === "resume" ? "cv" : "resume")}
                className="mt-6 w-full py-2 px-3 rounded-lg border border-hairline bg-canvas text-xs font-medium text-ink-light hover:border-accent-cyan/50 hover:text-accent-cyan transition-all text-center"
              >
                Switch to {activeTab === "resume" ? "5-Page Master CV" : "1-Page Resume"} &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
