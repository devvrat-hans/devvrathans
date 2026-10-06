"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Home,
  Layers,
  Mail,
  Moon,
  Search,
  Activity,
  Terminal,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useMode } from "./ModeProvider";
import { GithubIcon, LinkedinIcon, XIcon } from "./icons";
import { copyToClipboard } from "./Toaster";
import { EMAIL, SOCIALS } from "@/lib/site";

export const OPEN_PALETTE_EVENT = "site:open-palette";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Actions" | "Links";
  icon: LucideIcon | ((p: { size?: number }) => React.ReactElement);
  keywords?: string;
  hint?: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const router = useRouter();
  const pathname = usePathname() || "/";
  const { theme, toggleTheme } = useTheme();
  const { mode, setMode } = useMode();

  const close = useCallback(() => setOpen(false), []);
  // Mirror of `open` for the global key handler, which is registered once.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const show = useCallback(() => {
    setQuery("");
    setIndex(0);
    setOpen(true);
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      if (pathname !== "/") {
        router.push(`/#${id}`);
        return;
      }
      const wasTerminal = mode === "terminal";
      setMode("website");
      setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        wasTerminal ? 350 : 0
      );
    },
    [pathname, router, mode, setMode]
  );

  const goToRoute = useCallback(
    (href: string) => {
      setMode("website");
      router.push(href);
    },
    [router, setMode]
  );

  const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const commands: Command[] = useMemo(
    () => [
      { id: "home", label: "Home", group: "Navigate", icon: Home, run: () => {
          if (pathname !== "/") return goToRoute("/");
          setMode("website");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } },
      { id: "about", label: "About", group: "Navigate", icon: User, keywords: "bio education", run: () => goToSection("about") },
      { id: "experience", label: "Experience", group: "Navigate", icon: Briefcase, keywords: "work internships jobs", run: () => goToSection("experience") },
      { id: "projects", label: "Projects", group: "Navigate", icon: FolderGit2, keywords: "work portfolio built", run: () => goToSection("projects") },
      { id: "skills", label: "Skills", group: "Navigate", icon: Layers, keywords: "stack tech languages", run: () => goToSection("skills") },
      { id: "activity", label: "GitHub activity", group: "Navigate", icon: Activity, keywords: "contributions commits", run: () => goToSection("activity") },
      { id: "contact", label: "Contact", group: "Navigate", icon: Mail, keywords: "email reach hire", run: () => goToSection("contact") },
      { id: "blog", label: "Blog", group: "Navigate", icon: BookOpen, keywords: "writing posts articles", run: () => goToRoute("/blog") },
      { id: "resume", label: "Resume & CV", group: "Navigate", icon: FileText, keywords: "cv pdf download", run: () => goToRoute("/resume") },

      { id: "copy-email", label: "Copy email address", group: "Actions", icon: Copy, hint: EMAIL, run: () => copyToClipboard(EMAIL, "Email copied") },
      { id: "theme", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, group: "Actions", icon: Moon, keywords: "dark light mode appearance", run: toggleTheme },
      {
        id: "terminal",
        label: mode === "terminal" ? "Exit terminal mode" : "Open terminal mode",
        group: "Actions",
        icon: Terminal,
        keywords: "shell cli bash",
        run: () => setMode(mode === "terminal" ? "website" : "terminal"),
      },
      { id: "code", label: "View this site's source", group: "Actions", icon: Code2, keywords: "github repo", run: () => openExternal(SOCIALS.github.href) },

      { id: "github", label: "GitHub", group: "Links", icon: GithubIcon, hint: SOCIALS.github.handle, run: () => openExternal(SOCIALS.github.href) },
      { id: "linkedin", label: "LinkedIn", group: "Links", icon: LinkedinIcon, hint: SOCIALS.linkedin.handle, run: () => openExternal(SOCIALS.linkedin.href) },
      { id: "x", label: "X / Twitter", group: "Links", icon: XIcon, hint: SOCIALS.x.handle, run: () => openExternal(SOCIALS.x.href) },
      { id: "email", label: "Send an email", group: "Links", icon: Mail, run: () => (window.location.href = `mailto:${EMAIL}`) },
    ],
    [pathname, goToSection, goToRoute, theme, toggleTheme, mode, setMode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Global shortcuts: ⌘K / Ctrl+K toggles, "/" opens when not typing elsewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else show();
        return;
      }
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [show]);

  // Focus management + scroll lock
  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement | null;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        document.body.style.overflow = prev;
        restoreFocus.current?.focus?.();
      };
    }
  }, [open]);

  // Keep the highlighted option in view
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const run = (cmd: Command) => {
    close();
    // Let the dialog unmount (and restore scroll) before navigating.
    setTimeout(cmd.run, 10);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[index];
      if (cmd) run(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Single focusable element, so keep focus trapped in the dialog.
      e.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden border border-hairline bg-canvas shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4">
              <Search size={16} className="shrink-0 text-mute" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search pages, actions, links…"
                className="h-14 flex-1 bg-transparent text-[15px] text-ink-light placeholder:text-mute outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:block border border-hairline bg-canvas-soft px-1.5 py-0.5 font-mono text-[10px] text-mute">
                ESC
              </kbd>
            </div>

            <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-mute">No results for &ldquo;{query}&rdquo;</li>
              )}
              {filtered.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                const Icon = cmd.icon;
                const selected = i === index;
                return (
                  <li key={cmd.id} role="presentation">
                    {showGroup && (
                      <div className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-wider text-mute first:pt-1">
                        {cmd.group}
                      </div>
                    )}
                    <div
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={i}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => run(cmd)}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                        selected ? "bg-canvas-soft-2 text-ink-light" : "text-body"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center border ${
                          selected ? "border-hairline-strong text-accent" : "border-hairline text-mute"
                        }`}
                      >
                        <Icon size={14} />
                      </span>
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {cmd.hint && <span className="hidden sm:inline truncate font-mono text-[11px] text-mute">{cmd.hint}</span>}
                      {selected && <ArrowRight size={14} className="text-mute" aria-hidden="true" />}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-hairline bg-canvas-soft px-4 py-2.5 font-mono text-[10px] text-mute">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="border border-hairline px-1">↑</kbd>
                  <kbd className="border border-hairline px-1">↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-hairline px-1">
                    <CornerDownLeft size={9} className="inline" />
                  </kbd>{" "}
                  select
                </span>
              </span>
              <span>
                press <kbd className="border border-hairline px-1">/</kbd> anytime
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
