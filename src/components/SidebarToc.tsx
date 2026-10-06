"use client";

import { useState, useEffect } from "react";
import type { TocEntry } from "@/lib/blog-data";

export function useActiveHeading(headings: TocEntry[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

export default function SidebarToc({ headings }: { headings: TocEntry[] }) {
  const activeId = useActiveHeading(headings);

  return (
    <aside className="hidden lg:block sticky top-28 self-start w-56 shrink-0">
      <nav aria-label="On this page">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-mute">On this page</p>
        <ul className="space-y-0.5 border-l border-hairline">
          {headings.map((heading) => {
            const active = activeId === heading.id;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={active ? "location" : undefined}
                  className={`-ml-px block border-l py-1.5 text-[13px] leading-snug transition-colors ${
                    heading.level === 3 ? "pl-7" : "pl-4"
                  } ${
                    active
                      ? "border-accent text-ink-light"
                      : "border-transparent text-mute hover:border-hairline-strong hover:text-body"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-6 font-mono text-[11px] text-mute transition-colors hover:text-ink-light cursor-pointer"
        >
          ↑ Back to top
        </button>
      </nav>
    </aside>
  );
}
