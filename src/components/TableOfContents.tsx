"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, ChevronDown } from "lucide-react";
import type { TocEntry } from "@/lib/blog-data";
import { useActiveHeading } from "./SidebarToc";

/** Collapsible table of contents for screens below `lg`. */
export default function TableOfContents({ headings }: { headings: TocEntry[] }) {
  const activeId = useActiveHeading(headings);
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="mb-10 lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-toc"
        className="flex w-full items-center gap-2 border border-hairline bg-canvas-soft px-4 py-3 text-left transition-all hover:border-hairline-strong cursor-pointer"
      >
        <List size={14} className="text-accent" aria-hidden="true" />
        <span className="font-mono text-xs uppercase tracking-wider text-body">On this page</span>
        <span className="ml-auto font-mono text-[11px] text-mute">{headings.length}</span>
        <ChevronDown size={14} className={`text-mute transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            id="mobile-toc"
            aria-label="On this page"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="mt-2 space-y-0.5 border border-hairline bg-canvas-soft/50 px-2 py-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 text-sm leading-snug transition-colors ${
                      heading.level === 3 ? "pl-7 pr-3" : "px-3"
                    } ${activeId === heading.id ? "bg-canvas-soft-2 text-ink-light" : "text-body hover:text-ink-light"}`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
