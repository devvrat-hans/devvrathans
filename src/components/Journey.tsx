"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader, fadeUp } from "./Section";
import { JOURNEY, ABACK } from "@/lib/aback";

/**
 * The Aback story as a vertical timeline. A hairline rail runs down the milestones and fills
 * with the accent as the section scrolls past, so the reader's place in the story is visible.
 */
export default function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="journey" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="01"
          eyebrow="Journey"
          title="How Aback came together."
          description="From a founder's office to an independent group shipping its own products. The short version, in order, with the numbers left in."
          aside={
            <a
              href={ABACK.group.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              {ABACK.group.domain}
              <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          }
        />

        <ol ref={listRef} className="relative mt-16">
          {/* Rail: a static hairline with the scroll-driven accent fill on top */}
          <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-hairline md:left-[calc(12rem+5px)]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-accent md:left-[calc(12rem+5px)]"
          />

          {JOURNEY.map((m, i) => (
            <motion.li
              key={`${m.date}-${m.title}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="group relative grid grid-cols-[11px_minmax(0,1fr)] gap-x-6 pb-14 last:pb-0 md:grid-cols-[10rem_11px_minmax(0,1fr)] md:gap-x-8"
            >
              <div className="hidden pt-px text-right md:block">
                <div className="font-mono text-[13px] text-ink-light">{m.date}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-mute">
                  {String(i + 1).padStart(2, "0")} / {String(JOURNEY.length).padStart(2, "0")}
                </div>
              </div>

              {/* Node on the rail; the live milestone pulses in the accent colour */}
              <span aria-hidden="true" className="relative mt-[5px] flex h-[11px] w-[11px]">
                {m.current && <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-50" />}
                <span
                  className={`relative h-[11px] w-[11px] border transition-colors ${
                    m.current
                      ? "border-accent bg-accent"
                      : "border-hairline-strong bg-canvas group-hover:border-accent"
                  }`}
                />
              </span>

              <article className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-ink-light md:hidden">{m.date}</span>
                  <span
                    className={`border px-1.5 py-px font-mono text-[10px] uppercase tracking-wider ${
                      m.current ? "border-accent/40 text-accent" : "border-hairline text-mute"
                    }`}
                  >
                    {m.tag}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink-light sm:text-2xl">{m.title}</h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-body text-pretty">{m.body}</p>

                {m.points && (
                  <ul className="mt-5 max-w-2xl space-y-2.5">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                        <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}

                {m.link && <MilestoneLink {...m.link} />}
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MilestoneLink({ label, href }: { label: string; href: string }) {
  const className =
    "group/link mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-mute transition-colors hover:text-accent";
  const icon = (
    <ArrowUpRight size={12} className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
        {icon}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      {icon}
    </a>
  );
}
