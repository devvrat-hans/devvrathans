"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, ChevronRight } from "lucide-react";
import type { TocEntry } from "@/lib/blog-data";

export default function TableOfContents({ headings }: { headings: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full text-left rounded-lg border border-hairline bg-canvas-soft px-4 py-3 text-sm font-mono text-body hover:text-ink-light hover:border-hairline-strong transition-all"
        >
          <List size={14} className="text-accent-cyan" />
          <span className="text-xs uppercase tracking-wider text-mute">Table of contents</span>
          <ChevronRight
            size={12}
            className={`ml-auto text-mute transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
        </button>

        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-xl border border-hairline bg-canvas-soft/50 px-5 py-4 overflow-hidden"
          >
            <ul className="space-y-1.5">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-[13px] leading-snug transition-colors ${
                      activeId === heading.id
                        ? "text-accent-cyan"
                        : "text-mute hover:text-body"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
    </div>
  );
}
