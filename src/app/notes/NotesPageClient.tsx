"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, NotebookPen, Search, X } from "lucide-react";
import type { NoteSummary } from "@/lib/notes-data";
import { formatDate } from "@/lib/format";
import { fadeUp, stagger } from "@/components/Section";
import NewsletterCard from "@/components/NewsletterCard";

export default function NotesPageClient({ notes }: { notes: NoteSummary[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    notes.forEach((n) => n.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [notes]);

  const q = query.trim().toLowerCase();
  const visible = notes.filter(
    (n) =>
      (!tag || n.tags.includes(tag)) &&
      (!q || `${n.title} ${n.excerpt} ${n.tags.join(" ")}`.toLowerCase().includes(q))
  );

  // Group by year, newest first (notes are already sorted newest → oldest).
  const years = useMemo(() => {
    const groups = new Map<string, NoteSummary[]>();
    for (const n of visible) {
      const y = n.date.slice(0, 4) || "Undated";
      groups.set(y, [...(groups.get(y) ?? []), n]);
    }
    return [...groups.entries()];
  }, [visible]);

  return (
    <div className="bg-canvas">
      <main className="px-6 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <motion.header initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Notes
              <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
              <span className="text-mute">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink-light sm:text-5xl">Notes.</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-body">
              Short and unpolished, straight from my notebook. Things I&apos;m learning while building Aback, half-formed
              ideas, and references I keep coming back to.
            </p>
          </motion.header>

          {notes.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-12 border border-dashed border-hairline-strong p-8 text-center sm:p-12"
            >
              <NotebookPen size={22} className="mx-auto text-mute" aria-hidden="true" />
              <p className="mt-4 text-lg font-medium text-ink-light">The first notes are on their way.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-body">
                Subscribe below and they&apos;ll reach you along with the newsletter.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-10 space-y-4"
              >
                <label className="flex h-11 items-center gap-3 border border-hairline bg-canvas-soft px-3 transition-colors focus-within:border-hairline-strong">
                  <Search size={14} className="shrink-0 text-mute" aria-hidden="true" />
                  <span className="sr-only">Search notes</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes…"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink-light placeholder:text-mute outline-none"
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="flex h-7 w-7 items-center justify-center text-mute transition-colors hover:text-ink-light cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>

                {tags.length > 1 && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notes by tag">
                    {[null, ...tags].map((t) => {
                      const active = tag === t;
                      return (
                        <button
                          key={t ?? "all"}
                          onClick={() => setTag(t)}
                          aria-pressed={active}
                          className={`border px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                            active
                              ? "border-primary bg-primary text-on-primary"
                              : "border-hairline bg-canvas-soft text-body hover:border-hairline-strong hover:text-ink-light"
                          }`}
                        >
                          {t ? `#${t}` : "all"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <div className="mt-10" aria-live="polite">
                {years.length === 0 && (
                  <p className="border-t border-hairline py-10 text-center text-sm text-mute">
                    No notes match &ldquo;{query || `#${tag}`}&rdquo;.
                  </p>
                )}
                <AnimatePresence initial={false}>
                  {years.map(([year, group]) => (
                    <motion.section
                      key={`${year}-${tag ?? ""}-${q}`}
                      initial="hidden"
                      animate="visible"
                      variants={stagger(0.05)}
                      className="mb-10 last:mb-0"
                      aria-labelledby={`year-${year}`}
                    >
                      <div className="flex items-baseline justify-between border-b border-hairline-strong pb-3">
                        <h2 id={`year-${year}`} className="font-mono text-sm text-ink-light">
                          {year}
                        </h2>
                        <span className="font-mono text-[11px] text-mute">{String(group.length).padStart(2, "0")}</span>
                      </div>
                      <ol className="divide-y divide-hairline">
                        {group.map((note) => (
                          <motion.li key={note.slug} variants={fadeUp} transition={{ duration: 0.3 }}>
                            <Link
                              href={`/notes/${note.slug}`}
                              className="group grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-5 sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
                            >
                              <time dateTime={note.date} className="font-mono text-xs text-mute">
                                {formatDate(note.date).replace(/, \d{4}$/, "")}
                              </time>
                              <span className="min-w-0">
                                <span className="block text-[16px] font-medium text-ink-light transition-colors group-hover:text-accent">
                                  {note.title}
                                </span>
                                {note.excerpt && (
                                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-body">{note.excerpt}</span>
                                )}
                                {note.tags.length > 0 && (
                                  <span className="mt-2 block font-mono text-[10px] text-mute">
                                    {note.tags.map((t) => `#${t}`).join("  ")}
                                  </span>
                                )}
                              </span>
                              <ArrowRight
                                size={14}
                                className="text-mute transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                                aria-hidden="true"
                              />
                            </Link>
                          </motion.li>
                        ))}
                      </ol>
                    </motion.section>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="mt-16">
            <NewsletterCard
              source="notes"
              title="Notes like these, every other week."
              body="The best notes, what I shipped at Aback, and the numbers behind it. One short email, twice a month."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
