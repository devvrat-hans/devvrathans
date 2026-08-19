"use client";

import { useState, useEffect } from "react";
import type { TocEntry } from "@/lib/blog-data";

export default function SidebarToc({ headings }: { headings: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>("");

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

  return (
    <aside className="hidden lg:block sticky top-28 self-start w-52 shrink-0">
      <nav className="rounded-xl border border-hairline bg-canvas-soft/50 px-4 py-4">
        <span className="flex items-center gap-2 text-[10px] font-mono text-mute uppercase tracking-wider mb-3">
          On this page
        </span>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: heading.level === 3 ? "0.75rem" : "0" }}
            >
              <a
                href={`#${heading.id}`}
                className={`block text-[12px] leading-snug transition-colors ${
                  activeId === heading.id
                    ? "text-accent-cyan font-medium"
                    : "text-mute hover:text-body"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
