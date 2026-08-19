"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import SidebarToc from "@/components/SidebarToc";
import type { BlogPost } from "@/lib/blog-data";

export default function BlogPostClient({ post, posts }: { post: BlogPost; posts: BlogPost[] }) {
  const postIndex = posts.findIndex((p) => p.slug === post.slug);
  const nextPost = posts[postIndex + 1] || null;
  const prevPost = posts[postIndex - 1] || null;

  return (
    <div className="min-h-screen bg-canvas">
      <main className="pt-28 pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 text-[11px] font-mono text-accent-cyan"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-[-0.03em] text-ink-light leading-[1.15]">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-5 flex items-center gap-5 text-sm text-mute">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-accent-cyan" />
                {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-hairline" />
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-accent-cyan" />
                {post.readTime}
              </span>
            </div>

            {/* Divider */}
            <div className="mt-10 mb-10 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
          </motion.div>

          {/* Mobile TOC (collapsible) */}
          {post.headings.length > 0 && <TableOfContents headings={post.headings} />}

          {/* Two-column: desktop sidebar TOC + content */}
          <div className="lg:flex lg:gap-10">
            {/* Desktop sidebar TOC */}
            {post.headings.length > 0 && <SidebarToc headings={post.headings} />}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="blog-content text-[15px] sm:text-base min-w-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* End of post divider */}
          <div className="mt-16 mb-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-hairline" />
            <span className="text-xs font-mono text-mute">end of post</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-hairline" />
          </div>

          {/* Navigation between posts */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="flex-1 group rounded-xl border border-hairline bg-canvas-soft p-5 hover:border-accent-cyan/30 hover:bg-canvas-soft/80 transition-all"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-mute uppercase tracking-wider">
                  <ArrowLeft size={10} />
                  Previous
                </span>
                <p className="mt-2 text-sm font-medium text-ink-light group-hover:text-accent-cyan transition-colors line-clamp-2">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="flex-1 group rounded-xl border border-hairline bg-canvas-soft p-5 hover:border-accent-cyan/30 hover:bg-canvas-soft/80 transition-all text-right"
              >
                <span className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-mute uppercase tracking-wider">
                  Next
                  <ArrowRight size={10} />
                </span>
                <p className="mt-2 text-sm font-medium text-ink-light group-hover:text-accent-cyan transition-colors line-clamp-2">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>

          {/* Back */}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-body hover:text-ink-light transition-colors"
            >
              <ArrowLeft size={14} />
              All posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
