"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// ── Virtual Filesystem ──────────────────────────────────────────────
interface FileNode {
  type: "file" | "dir";
  name: string;
  content?: string;
  children?: Record<string, FileNode>;
}

const FILESYSTEM: FileNode = {
  type: "dir",
  name: "~",
  children: {
    about: {
      type: "dir",
      name: "about",
      children: {
        "bio.txt": {
          type: "file",
          name: "bio.txt",
          content: [
            "Name:       Devvrat Hans",
            "Role:       Software Engineer & Builder",
            "Education:  B.Tech CSE, IIT Gandhinagar",
            "CGPA:       8.30/10",
            "Email:      devvrat.coding@gmail.com",
            "",
            "I build production software with a focus on agentic AI,",
            "AI governance & evaluation, and full-stack development.",
            "Passionate about turning ideas into deployed products.",
          ].join("\n"),
        },
        "education.txt": {
          type: "file",
          name: "education.txt",
          content: [
            "B.Tech Computer Science & Engineering",
            "  Institute:  IIT Gandhinagar",
            "  Period:     2023 - 2027",
            "  CPI:        8.30/10",
            "",
            "Class XII - White Leaf Public School",
            "  Period: 2022-2023 | Score: 94.40%",
            "",
            "Class X - Modern Delhi Public School",
            "  Period: 2020-2021 | Score: 97.00%",
          ].join("\n"),
        },
        "highlights.txt": {
          type: "file",
          name: "highlights.txt",
          content: [
            "JEE Advanced AIR 1505 (top 1%)",
            "JEE Mains 99.65 percentile",
            "Finnovate Hack 2025 Runner-Up",
            "Dean's List - Semester I",
            "FIDE Rapid Rating: 1437",
            "Chess.com Peak: 1938 (Rapid)",
            "AbackTools.com: ~500 daily clicks",
          ].join("\n"),
        },
      },
    },
    experience: {
      type: "dir",
      name: "experience",
      children: {
        "intentyfi.txt": {
          type: "file",
          name: "intentyfi.txt",
          content: [
            "Role:    Software Engineering Intern",
            "Company: Intentyfi",
            "Period:  Feb '26 - Jul '26",
            "Stack:   Rust, Axum, PostgreSQL, Next.js, GCP",
            "",
            "Highlights:",
            "  - Architected Case Management App from scratch",
            "  - Built production RAG infrastructure",
            "  - Implemented AI-agent security controls",
            "  - Developed LLM orchestration with Gemini",
          ].join("\n"),
        },
        "aback.txt": {
          type: "file",
          name: "aback.txt",
          content: [
            "Role:    Founder's Office - Technology",
            "Company: Aback.ai",
            "Period:  Jun '25 - Feb '26",
            "Stack:   Full Stack, AI/ML, Product, Cloud",
            "",
            "Highlights:",
            "  - Led technology across all verticals",
            "  - Built AbackTools.com (~500 clicks/day)",
            "  - Contributed to QRliee, Invoice, Inventory products",
          ].join("\n"),
        },
        "trado.txt": {
          type: "file",
          name: "trado.txt",
          content: [
            "Role:    Development Intern",
            "Company: Trado (Windigo Trade)",
            "Period:  Nov '25 - Jan '26",
            "Stack:   Python, LEAN, Trading, API",
            "",
            "Highlights:",
            "  - Developed algorithmic trading platform",
            "  - Built backtesting & live trading pipeline",
            "  - Led Connect by Trado from scratch",
          ].join("\n"),
        },
        "curlsek.txt": {
          type: "file",
          name: "curlsek.txt",
          content: [
            "Role:    Development Intern",
            "Company: Curlsek AI Technologies",
            "Period:  Mar '25 - Jul '25",
            "Stack:   Spring Boot, MongoDB, Security, AI",
            "",
            "Highlights:",
            "  - Built AI-powered cybersecurity portal PoC",
            "  - Designed secure auth APIs with RBAC",
          ].join("\n"),
        },
      },
    },
    projects: {
      type: "dir",
      name: "projects",
      children: {
        "toonifyit.txt": {
          type: "file",
          name: "toonifyit.txt",
          content: [
            "Name:   ToonifyIt",
            "URL:    toonifyit.com",
            "Stack:  Next.js, TypeScript",
            "",
            "LLM developer tool converting JSON to TOON",
            "(Token-Oriented Object Notation) for token-efficient",
            "data representation in LLM workflows.",
            "",
            "Features:",
            "  - Real-time browser-based conversion",
            "  - Client-side processing (zero data leaves device)",
            "  - Configurable delimiters & length markers",
          ].join("\n"),
        },
        "yourcode.txt": {
          type: "file",
          name: "yourcode.txt",
          content: [
            "Name:   YourCode",
            "URL:    yourcode.space",
            "Stack:  TypeScript, CLI, Monorepo",
            "",
            "Open-source terminal-based coding agent for writing",
            "code and managing dev sessions with AI assistance.",
            "",
            "Features:",
            "  - Terminal-first - no browser/Electron",
            "  - Modular monorepo architecture",
            "  - Persistent sessions, customizable themes",
          ].join("\n"),
        },
        "boeing.txt": {
          type: "file",
          name: "boeing.txt",
          content: [
            "Name:   Boeing BUILD 2026 Website",
            "URL:    build.boeing.com",
            "",
            "Official Boeing BUILD 2026 India website -",
            "program info, event details, application workflows.",
            "",
            "Delivered end-to-end from stakeholder requirements",
            "to production deployment.",
          ].join("\n"),
        },
        "blindrop.txt": {
          type: "file",
          name: "blindrop.txt",
          content: [
            "Name:   BlindDrop",
            "Stack:  Next.js, Flask, SQLite",
            "",
            "Privacy-focused anonymous file-transfer system",
            "with one-time download codes and auto-expiry.",
            "",
            "Features:",
            "  - Hash-based horizontal sharding (3 SQLite DBs)",
            "  - SHA-256 integrity, UUID storage, rate limiting",
            "  - Supports files up to 100MB",
          ].join("\n"),
        },
        "research-park.txt": {
          type: "file",
          name: "research-park.txt",
          content: [
            "Name:   IITGN Research Park Website",
            "URL:    iitgnrp.com",
            "Stack:  Next.js, SSR",
            "",
            "Official website for the IIT Gandhinagar Research",
            "Park - industry-academia collaboration ecosystem.",
          ].join("\n"),
        },
        "zerowaste.txt": {
          type: "file",
          name: "zerowaste.txt",
          content: [
            "Name:   Zero Waste Gujarat",
            "URL:    zerowastegujarat.com",
            "Stack:  Next.js, SSR",
            "",
            "Textile waste-to-value initiative - recycling,",
            "sustainable nonwovens, carbon-credit solutions.",
          ].join("\n"),
        },
        "chess.txt": {
          type: "file",
          name: "chess.txt",
          content: [
            "Name:   Chess Website - IITGN",
            "Stack:  HTML, CSS, JavaScript",
            "",
            "Official web platform for the IIT Gandhinagar",
            "chess community - events, registration, gallery.",
          ].join("\n"),
        },
        "finguard.txt": {
          type: "file",
          name: "finguard.txt",
          content: [
            "Name:   FinGuard AI",
            "Stack:  Python, AI/ML",
            "Event:  Finnovate Hack 2025 (Runner-Up)",
            "",
            "AI-powered expense auditing platform -",
            "invoice extraction, anomaly detection, compliance.",
          ].join("\n"),
        },
      },
    },
    skills: {
      type: "dir",
      name: "skills",
      children: {
        "languages.txt": {
          type: "file",
          name: "languages.txt",
          content: "Python  C  C++  Java  Rust  SQL  JavaScript  TypeScript  HTML  CSS",
        },
        "frameworks.txt": {
          type: "file",
          name: "frameworks.txt",
          content: "React.js  Next.js  Angular  RxJS  Spring Boot  FastAPI  Axum  Flask  TensorFlow  Keras",
        },
        "ai-ml.txt": {
          type: "file",
          name: "ai-ml.txt",
          content: "Machine Learning  Deep Learning  NLP  Computer Vision  LLMs  RAG  Agentic AI  AI Governance & Evaluation  Prompt Engineering  Gemini  Vector Retrieval  Google ADK",
        },
        "databases.txt": {
          type: "file",
          name: "databases.txt",
          content: "PostgreSQL  MongoDB  MySQL  SQLx  Prisma",
        },
        "cloud.txt": {
          type: "file",
          name: "cloud.txt",
          content: "GCP  Cloud Run  Cloud Build  Cloud SQL  Vertex AI  Docker  GCP IAM",
        },
        "security.txt": {
          type: "file",
          name: "security.txt",
          content: "Auth/RBAC  PII Masking  Prompt Injection Detection  SQL AST Validation  REST APIs  Microservices  SSE",
        },
        "competitive.txt": {
          type: "file",
          name: "competitive.txt",
          content: [
            "Competitive Programming:",
            "  Codeforces:  1200+",
            "  Leetcode:    1500+",
            "",
            "Chess:",
            "  FIDE Rating (Rapid):    1437",
            "  Chess.com Peak (Rapid): 1938",
          ].join("\n"),
        },
      },
    },
    contact: {
      type: "dir",
      name: "contact",
      children: {
        "contact.txt": {
          type: "file",
          name: "contact.txt",
          content: [
            "Email:    devvrat.coding@gmail.com",
            "Twitter:   x.com/devvrat_hans",
            "LinkedIn: linkedin.com/in/devvrathans/",
            "GitHub:   github.com/devvrat-hans",
          ].join("\n"),
        },
      },
    },
    ".hidden": {
      type: "dir",
      name: ".hidden",
      children: {
        "easter-egg.txt": {
          type: "file",
          name: "easter-egg.txt",
          content: [
            "You found a secret!",
            "",
            "Fun fact: I organized a week-long chess league",
            "with 80+ players across 6 teams at IITGN.",
            "",
            "Also, I once introduced a 3-player chess variant",
            "at a campus event. Yes, 3 players. It was chaos.",
            "Beautiful chaos.",
          ].join("\n"),
        },
      },
    },
  },
};

// ── Terminal Component ──────────────────────────────────────────────
interface TerminalLine {
  type: "input" | "output" | "error" | "system" | "dir" | "file" | "success";
  text: string;
}

function resolvePath(cwd: string, path: string): FileNode | null {
  const parts = path.startsWith("~")
    ? path.split("/").filter(Boolean)
    : [...cwd.split("/").filter(Boolean), ...path.split("/").filter(Boolean)];

  let node: FileNode = FILESYSTEM;
  for (const part of parts) {
    if (part === "..") {
      // go up
      continue;
    }
    if (part === "." || part === "~") continue;
    if (!node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

function getParentPath(cwd: string, target: string): string {
  const parts = target.startsWith("~")
    ? target.split("/").filter(Boolean)
    : [...cwd.split("/").filter(Boolean), ...target.split("/").filter(Boolean)];
  // resolve .. and .
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "..") {
      resolved.pop();
    } else if (p !== "." && p !== "~") {
      resolved.push(p);
    }
  }
  return "~" + (resolved.length ? "/" + resolved.join("/") : "");
}

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabCount, setTabCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    const boot: TerminalLine[] = [
      { type: "system", text: "  ██████╗ ███████╗██╗   ██╗██╗   ██╗██████╗  █████╗ ████████╗" },
      { type: "system", text: "  ██╔══██╗██╔════╝██║   ██║██║   ██║██╔═ ██║██╔══██╗╚══██╔══╝" },
      { type: "system", text: "  ██║  ██║█████╗  ██║   ██║██║   ██║██║██║  ███████║   ██║   " },
      { type: "system", text: "  ██║  ██║██╔══╝  ╚██╗ ██╔╝╚██╗ ██╔╝██║ ██║ ██╔══██║   ██║   " },
      { type: "system", text: "  ██████╔╝███████╗ ╚████╔╝  ╚████╔╝ ██║  ██║██║  ██║   ██║   " },
      { type: "system", text: "  ╚═════╝ ╚══════╝  ╚═══╝    ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   " },
      { type: "output", text: "" },
      { type: "output", text: "  Welcome. I'm Devvrat Hans - Software Engineer & Builder." },
      { type: "output", text: "  B.Tech CSE @ IIT Gandhinagar | CPI: 8.30/10" },
      { type: "output", text: "" },
      { type: "output", text: "  This is an interactive terminal. Try:" },
      { type: "output", text: "    ls              - list directories" },
      { type: "output", text: "    cd projects     - navigate into a folder" },
      { type: "output", text: "    cat about.txt   - read a file" },
      { type: "output", text: "    help            - see all commands" },
      { type: "output", text: "" },
      { type: "output", text: "  Use up/down arrows for history, Tab for autocomplete." },
      { type: "output", text: "" },
    ];
    setLines(boot);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const prompt = `devvrathans:${cwd}$`;

  const processCommand = useCallback((raw: string): TerminalLine[] => {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // Parse command, flags, and args
    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0];
    const args = tokens.slice(1);
    const flags = args.filter((a) => a.startsWith("-"));
    const positional = args.filter((a) => !a.startsWith("-"));
    const hasFlag = (f: string) => flags.includes(f);

    switch (cmd) {
      case "help": {
        const lines: TerminalLine[] = [
          { type: "success", text: "Available commands:" },
          { type: "output", text: "" },
          { type: "output", text: "  NAVIGATION" },
          { type: "output", text: "    ls [path]              list directory contents" },
          { type: "output", text: "    ls -a [path]           list including hidden" },
          { type: "output", text: "    cd <path>              change directory" },
          { type: "output", text: "    cd ~                   go to home" },
          { type: "output", text: "    cd ..                  go up one level" },
          { type: "output", text: "    pwd                    print working directory" },
          { type: "output", text: "" },
          { type: "output", text: "  FILES" },
          { type: "output", text: "    cat <file>             display file contents" },
          { type: "output", text: "    cat -n <file>          display with line numbers" },
          { type: "output", text: "    head <file>            first 5 lines" },
          { type: "output", text: "    tail <file>            last 5 lines" },
          { type: "output", text: "    wc <file>              word/line count" },
          { type: "output", text: "    find <pattern>         search for files" },
          { type: "output", text: "" },
          { type: "output", text: "  INFO" },
          { type: "output", text: "    whoami                 who am I" },
          { type: "output", text: "    date                   current date" },
          { type: "output", text: "    uptime                 how long this terminal has been open" },
          { type: "output", text: "    uname                  system info" },
          { type: "output", text: "    tree [path]            directory tree" },
          { type: "output", text: "" },
          { type: "output", text: "  SHORTCUTS" },
          { type: "output", text: "    about                  cd + cat about" },
          { type: "output", text: "    experience             cd + cat experience" },
          { type: "output", text: "    projects               cd + cat projects" },
          { type: "output", text: "    skills                 cd + cat skills" },
          { type: "output", text: "    contact                cd + cat contact" },
          { type: "output", text: "" },
          { type: "output", text: "  SYSTEM" },
          { type: "output", text: "    clear                  clear terminal" },
          { type: "output", text: "    history                show command history" },
          { type: "output", text: "    echo <text>            print text" },
          { type: "output", text: "    exit                   return to website" },
        ];
        if (hasFlag("-v") || hasFlag("--verbose")) {
          lines.push(
            { type: "output", text: "" },
            { type: "output", text: "  FLAGS:" },
            { type: "output", text: "    -h, --help     show help for a command" },
            { type: "output", text: "    -v, --verbose  verbose output" },
            { type: "output", text: "    -a, --all      show hidden items" },
            { type: "output", text: "    -l             long listing format" },
            { type: "output", text: "    -n             show line numbers" },
          );
        }
        return lines;
      }

      case "ls": {
        const target = positional[0] || cwd;
        const node = resolvePath(cwd, target);
        if (!node) return [{ type: "error", text: `ls: cannot access '${target}': No such file or directory` }];
        if (node.type === "file") return [{ type: "output", text: target }];

        const showHidden = hasFlag("-a") || hasFlag("--all");
        const longFormat = hasFlag("-l");
        const entries = Object.values(node.children || {}).filter(
          (e) => showHidden || !e.name.startsWith(".")
        );

        if (entries.length === 0) return [{ type: "output", text: "(empty directory)" }];

        if (longFormat) {
          const result: TerminalLine[] = [
            { type: "output", text: `total ${entries.length}` },
          ];
          for (const e of entries) {
            const isDir = e.type === "dir";
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
            const size = e.content ? String(e.content.length).padStart(6) : "  4096";
            const date = "Aug 19 15:00";
            const name = isDir ? `${e.name}/` : e.name;
            result.push({
              type: isDir ? "dir" : "file",
              text: `${perms}  ${size} ${date} ${name}`,
            });
          }
          return result;
        }

        return [
          {
            type: "output",
            text: entries
              .map((e) => (e.type === "dir" ? `${e.name}/` : e.name))
              .join("  "),
          },
        ];
      }

      case "cd": {
        const target = positional[0] || "~";
        if (target === "~") {
          setCwd("~");
          return [];
        }
        if (target === "..") {
          const parent = getParentPath(cwd, "..");
          setCwd(parent);
          return [];
        }
        const node = resolvePath(cwd, target);
        if (!node) return [{ type: "error", text: `cd: no such file or directory: ${target}` }];
        if (node.type !== "dir") return [{ type: "error", text: `cd: not a directory: ${target}` }];
        setCwd(getParentPath(cwd, target));
        return [];
      }

      case "pwd":
        return [{ type: "output", text: cwd === "~" ? `/home/devvrathans` : `/home/devvrathans/${cwd.slice(2)}` }];

      case "cat": {
        if (positional.length === 0) return [{ type: "error", text: "cat: missing operand" }];
        const target = positional[0];
        const node = resolvePath(cwd, target);
        if (!node) return [{ type: "error", text: `cat: ${target}: No such file or directory` }];
        if (node.type === "dir") return [{ type: "error", text: `cat: ${target}: Is a directory` }];

        const content = node.content || "";
        if (hasFlag("-n") || hasFlag("--number")) {
          const numbered = content
            .split("\n")
            .map((line, i) => `  ${String(i + 1).padStart(3)}  ${line}`)
            .join("\n");
          return [{ type: "output", text: numbered }];
        }
        return content.split("\n").map((line) => ({ type: "output" as const, text: line }));
      }

      case "head": {
        if (positional.length === 0) return [{ type: "error", text: "head: missing operand" }];
        const node = resolvePath(cwd, positional[0]);
        if (!node || node.type === "dir")
          return [{ type: "error", text: `head: ${positional[0]}: No such file` }];
        const lines = (node.content || "").split("\n").slice(0, 5);
        return lines.map((l) => ({ type: "output" as const, text: l }));
      }

      case "tail": {
        if (positional.length === 0) return [{ type: "error", text: "tail: missing operand" }];
        const node = resolvePath(cwd, positional[0]);
        if (!node || node.type === "dir")
          return [{ type: "error", text: `tail: ${positional[0]}: No such file` }];
        const all = (node.content || "").split("\n");
        const lines = all.slice(-5);
        return lines.map((l) => ({ type: "output" as const, text: l }));
      }

      case "wc": {
        if (positional.length === 0) return [{ type: "error", text: "wc: missing operand" }];
        const node = resolvePath(cwd, positional[0]);
        if (!node || node.type === "dir")
          return [{ type: "error", text: `wc: ${positional[0]}: No such file` }];
        const content = node.content || "";
        const lineCount = content.split("\n").length;
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const charCount = content.length;
        return [
          {
            type: "output",
            text: `  ${String(lineCount).padStart(4)} lines  ${String(wordCount).padStart(4)} words  ${String(charCount).padStart(4)} chars  ${positional[0]}`,
          },
        ];
      }

      case "find": {
        if (positional.length === 0) return [{ type: "error", text: "find: missing search pattern" }];
        const pattern = positional[0].toLowerCase();
        const results: string[] = [];
        const search = (node: FileNode, path: string) => {
          if (node.name.toLowerCase().includes(pattern)) {
            results.push(path);
          }
          if (node.children) {
            for (const child of Object.values(node.children)) {
              search(child, `${path}/${child.name}`);
            }
          }
        };
        search(FILESYSTEM, "~");
        if (results.length === 0) return [{ type: "output", text: "(no matches)" }];
        return results.map((r) => ({ type: "output" as const, text: r }));
      }

      case "whoami":
        return [{ type: "output", text: "devvrathans" }];

      case "date":
        return [{ type: "output", text: new Date().toString() }];

      case "uname":
        if (hasFlag("-a") || hasFlag("--all"))
          return [
            {
              type: "output",
              text: "PortfolioOS 1.0.0 devvrathans-terminal 1.0.0-web x86_64 JavaScript",
            },
          ];
        return [{ type: "output", text: "PortfolioOS" }];

      case "uptime": {
        const start = performance.now();
        const seconds = Math.floor(start / 1000);
        const mins = Math.floor(seconds / 60);
        const hrs = Math.floor(mins / 60);
        return [
          {
            type: "output",
            text: ` up ${hrs}:${String(mins % 60).padStart(2, "0")}, 1 user, load average: 0.42, 0.37, 0.28`,
          },
        ];
      }

      case "tree": {
        const target = positional[0] || cwd;
        const node = resolvePath(cwd, target);
        if (!node || node.type !== "dir")
          return [{ type: "error", text: `tree: ${target}: No such directory` }];

        const result: TerminalLine[] = [{ type: "dir", text: target === "~" ? "~" : target }];
        const buildTree = (n: FileNode, prefix: string, isLast: boolean) => {
          const entries = Object.values(n.children || {}).filter(
            (e) => !e.name.startsWith(".")
          );
          entries.forEach((child, i) => {
            const last = i === entries.length - 1;
            const connector = last ? "└── " : "├── ";
            const type = child.type === "dir" ? "dir" : "file";
            result.push({
              type,
              text: `${prefix}${connector}${child.name}${child.type === "dir" ? "/" : ""}`,
            });
            if (child.type === "dir" && child.children) {
              buildTree(child, prefix + (last ? "    " : "│   "), last);
            }
          });
        };
        buildTree(node, "", true);
        return result;
      }

      case "echo":
        return [{ type: "output", text: args.join(" ") }];

      case "history":
        return history.map((cmd, i) => ({
          type: "output" as const,
          text: `  ${String(i + 1).padStart(4)}  ${cmd}`,
        }));

      case "clear":
        setLines([]);
        return [];

      case "exit":
        onClose();
        return [];

      // ── Shortcut commands ──
      case "about":
        setCwd("~/about");
        return [
          { type: "output", text: `cd ~/about && cat bio.txt` },
          { type: "output", text: "" },
          ...(
            resolvePath("~", "about/bio.txt")?.content || ""
          ).split("\n").map((l) => ({ type: "output" as const, text: l })),
        ];

      case "experience":
        setCwd("~/experience");
        return [
          { type: "output", text: `cd ~/experience` },
          { type: "output", text: "" },
          { type: "output", text: "  intentyfi.txt    aback.txt    trado.txt    curlsek.txt" },
          { type: "output", text: "" },
          { type: "output", text: "  Use cat <filename> to read details about each role." },
        ];

      case "projects": {
        setCwd("~/projects");
        const projectNames = Object.keys(FILESYSTEM.children?.projects?.children || {}).map((f) => f.replace(".txt", ""));
        const projectRows: TerminalLine[] = [];
        for (let i = 0; i < projectNames.length; i += 3) {
          const row = projectNames.slice(i, i + 3).map((n) => n.padEnd(16)).join("");
          projectRows.push({ type: "output", text: row });
        }
        return [
          { type: "output", text: `cd ~/projects` },
          { type: "output", text: "" },
          ...projectRows,
          { type: "output", text: "" },
          { type: "output", text: "  Use cat <name>.txt to read about each project." },
        ];
      }

      case "skills": {
        setCwd("~/skills");
        const skillNames = Object.keys(FILESYSTEM.children?.skills?.children || {}).map((f) => f.replace(".txt", ""));
        const skillRows: TerminalLine[] = [];
        for (let i = 0; i < skillNames.length; i += 3) {
          const row = skillNames.slice(i, i + 3).map((n) => n.padEnd(16)).join("");
          skillRows.push({ type: "output", text: row });
        }
        return [
          { type: "output", text: `cd ~/skills` },
          { type: "output", text: "" },
          ...skillRows,
          { type: "output", text: "" },
          { type: "output", text: "  Use cat <name>.txt to read each skill category." },
        ];
      }

      case "contact":
        setCwd("~/contact");
        return [
          { type: "output", text: `cd ~/contact` },
          { type: "output", text: "" },
          ...(
            resolvePath("~", "contact/contact.txt")?.content || ""
          ).split("\n").map((l) => ({ type: "output" as const, text: l })),
        ];

      default:
        return [
          {
            type: "error",
            text: `bash: ${cmd}: command not found. Type 'help' for available commands.`,
          },
        ];
    }
  }, [cwd, history, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setTabCount(0);

    const promptLine: TerminalLine = { type: "input", text: `${prompt} ${cmd}` };
    const output = processCommand(cmd);

    setLines((prev) => [...prev, promptLine, ...output]);
    setInput("");
  };

  // Tab autocomplete
  const handleTab = useCallback(() => {
    const tokens = input.split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (!last) return;

    const node = resolvePath(cwd, last.includes("/") ? last.slice(0, last.lastIndexOf("/")) : ".");
    if (!node?.children) return;

    const prefix = last.includes("/") ? last.slice(last.lastIndexOf("/") + 1) : last;
    const matches = Object.keys(node.children).filter((n) =>
      n.startsWith(prefix)
    );

    if (matches.length === 1) {
      const dir = last.includes("/") ? last.slice(0, last.lastIndexOf("/") + 1) : "";
      tokens[tokens.length - 1] = dir + matches[0];
      setInput(tokens.join(" "));
      setTabCount(0);
    } else if (matches.length > 1 && tabCount > 0) {
      // Show all matches
      const promptLine: TerminalLine = { type: "input", text: `${prompt} ${input}` };
      const matchLine: TerminalLine = {
        type: "output",
        text: matches.join("  "),
      };
      setLines((prev) => [...prev, promptLine, matchLine]);
      setTabCount(0);
    } else {
      setTabCount((prev) => prev + 1);
    }
  }, [input, cwd, tabCount, prompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIdx);
        setInput(history[history.length - 1 - newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(history[history.length - 1 - newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTab();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-terminal-bg pt-16 pb-4"
    >
      <div className="mx-auto px-4 h-[calc(100vh-4.5rem)]">
        <div className="h-full flex flex-col rounded-xl border border-hairline bg-canvas overflow-hidden relative">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-canvas-soft">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2 text-xs font-mono text-mute">
              devvrathans - bash
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-sm"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`
                  ${line.type === "input" ? "text-terminal-prompt" : ""}
                  ${line.type === "error" ? "text-[#ff5f57]" : ""}
                  ${line.type === "system" ? "text-accent-cyan" : ""}
                  ${line.type === "success" ? "text-accent-cyan font-medium" : ""}
                  ${line.type === "dir" ? "text-accent-blue" : ""}
                  ${line.type === "file" ? "text-body" : ""}
                  ${line.type === "output" ? "text-terminal-output" : ""}
                  whitespace-pre leading-relaxed
                `}
              >
                {line.text}
              </div>
            ))}

            {/* Input line */}
            <form onSubmit={handleSubmit} className="flex items-center gap-0 mt-0.5">
              <span className="text-terminal-prompt shrink-0">{prompt}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setTabCount(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-terminal-text caret-terminal-cursor ml-2 font-mono text-sm"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
