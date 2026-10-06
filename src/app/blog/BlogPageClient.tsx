"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/format";
import { fadeUp, stagger, trackSpotlight } from "@/components/Section";

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [posts]);

  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <div className="bg-canvas">
      <main className="px-6 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <motion.header initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Blog
              <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
              <span className="text-mute">{posts.length} posts</span>
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink-light sm:text-5xl">Writing.</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-body">
              Thoughts on building software, developer tools, AI, and the occasional life update. Nothing fancy,
              just honest writing.
            </p>
          </motion.header>

          {tags.length > 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-10 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter posts by tag"
            >
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
            </motion.div>
          )}

          <motion.ol
            key={tag ?? "all"}
            initial="hidden"
            animate="visible"
            variants={stagger(0.07, 0.1)}
            className="mt-8 space-y-3"
          >
            <AnimatePresence>
              {visible.map((post, i) => (
                <motion.li key={post.slug} variants={fadeUp} transition={{ duration: 0.35 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    onPointerMove={trackSpotlight}
                    className="spotlight card-elevated card-hover group block border border-hairline bg-canvas-soft p-6 sm:p-7"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mute">
                      {i === 0 && !tag && (
                        <span className="border border-accent/40 px-1.5 py-px text-[10px] uppercase tracking-wider text-accent">
                          latest
                        </span>
                      )}
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink-light transition-colors group-hover:text-accent sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                        {post.tags.map((t) => (
                          <li key={t} className="border border-hairline bg-canvas px-2 py-0.5 font-mono text-[10px] text-mute">
                            #{t}
                          </li>
                        ))}
                      </ul>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-body transition-colors group-hover:text-ink-light">
                        Read
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        </div>
      </main>
    </div>
  );
}
