"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, NotebookPen } from "lucide-react";
import { SectionHeader, fadeUp, stagger, trackSpotlight } from "./Section";
import { formatDate } from "@/lib/format";

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
}

export interface NoteRow {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

const allLink =
  "group inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-ink-light";

/** Latest posts and recent notes on /me, side by side. */
export default function Writing({ posts, notes }: { posts: PostSummary[]; notes: NoteRow[] }) {
  return (
    <section id="writing" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="03"
          eyebrow="Writing"
          title="Words, as I go."
          description="Longer posts when something is worth explaining properly, and shorter notes from Notion for everything I'm figuring out in between."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          {/* Posts */}
          <div>
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline-strong pb-4">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink-light">Latest posts</h3>
              <Link href="/blog" className={allLink}>
                All posts
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger(0.07)}
              className="mt-4 space-y-3"
            >
              {posts.map((post) => (
                <motion.li key={post.slug} variants={fadeUp} transition={{ duration: 0.35 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    onPointerMove={trackSpotlight}
                    className="spotlight card-elevated card-hover group block border border-hairline bg-canvas-soft p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mute">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <h4 className="mt-2.5 text-[17px] font-semibold tracking-tight text-ink-light transition-colors group-hover:text-accent">
                      {post.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-body">{post.excerpt}</p>
                  </Link>
                </motion.li>
              ))}
            </motion.ol>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline-strong pb-4">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink-light">Recent notes</h3>
              <Link href="/notes" className={allLink}>
                All notes
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            {notes.length > 0 ? (
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger(0.06)}
                className="divide-y divide-hairline"
              >
                {notes.map((note) => (
                  <motion.li key={note.slug} variants={fadeUp} transition={{ duration: 0.3 }}>
                    <Link
                      href={`/notes/${note.slug}`}
                      className="group grid grid-cols-[5.75rem_minmax(0,1fr)_auto] items-baseline gap-3 py-4 transition-colors"
                    >
                      <time dateTime={note.date} className="font-mono text-[11px] text-mute">
                        {formatDate(note.date)}
                      </time>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] text-ink-light transition-colors group-hover:text-accent">
                          {note.title}
                        </span>
                        {note.tags.length > 0 && (
                          <span className="mt-0.5 block truncate font-mono text-[10px] text-mute">
                            {note.tags.map((t) => `#${t}`).join(" ")}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-mute opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <div className="mt-4 flex items-start gap-4 border border-dashed border-hairline-strong p-6">
                <NotebookPen size={18} className="mt-0.5 shrink-0 text-mute" aria-hidden="true" />
                <div>
                  <p className="text-[15px] text-ink-light">The first notes are on their way.</p>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    Short, unpolished, straight from my notebook. Subscribe below to catch them as they land.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
