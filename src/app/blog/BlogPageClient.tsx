"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="min-h-screen bg-canvas">
      <main className="pt-28 pb-24 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-xs text-accent-cyan tracking-wide uppercase">
              // blog
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-ink-light">
              Writing.
            </h1>
            <p className="mt-4 max-w-xl text-body leading-relaxed">
              Thoughts on building software, developer tools, AI, and the
              occasional life update. Nothing fancy - just honest writing.
            </p>
          </motion.div>

          {/* Posts */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="mt-12 space-y-4"
          >
            {posts.map((post) => (
              <motion.div key={post.slug} variants={fadeUp} transition={{ duration: 0.4 }}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-hairline bg-canvas-soft p-6 hover:border-hairline-strong transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-base font-medium text-ink-light group-hover:text-accent-cyan transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-body leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-mute font-mono shrink-0">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-canvas border border-hairline px-2 py-0.5 text-[10px] font-mono text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
