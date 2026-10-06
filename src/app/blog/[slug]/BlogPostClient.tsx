"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Link2 } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import SidebarToc from "@/components/SidebarToc";
import { copyToClipboard } from "@/components/Toaster";
import { XIcon, LinkedinIcon, LogoMark } from "@/components/icons";
import type { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/format";

export default function BlogPostClient({ post, posts }: { post: BlogPost; posts: BlogPost[] }) {
  // Posts are sorted newest → oldest.
  const postIndex = posts.findIndex((p) => p.slug === post.slug);
  const olderPost = posts[postIndex + 1] || null;
  const newerPost = posts[postIndex - 1] || null;

  const shareUrl = `https://devvrathans.com/blog/${post.slug}/`;

  // Delegated handler for the server-rendered post HTML: code-block copy buttons.
  const onArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-code]");
    if (!btn) return;
    const code = btn.parentElement?.querySelector("pre")?.textContent ?? "";
    copyToClipboard(code, "Code copied");
    btn.textContent = "Copied";
    btn.setAttribute("data-copied", "");
    window.setTimeout(() => {
      btn.textContent = "Copy";
      btn.removeAttribute("data-copied");
    }, 1600);
  };
  const shareBtn =
    "flex h-9 w-9 items-center justify-center border border-hairline text-body transition-colors hover:border-hairline-strong hover:text-ink-light cursor-pointer";

  return (
    <div className="bg-canvas">
      <main className="px-6 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-mute transition-colors hover:text-ink-light"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              All posts
            </Link>

            <h1 className="mt-6 text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.04em] text-ink-light text-balance sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-body text-pretty">{post.excerpt}</p>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mute">
                <span className="flex items-center gap-2 text-ink-light">
                  <LogoMark />
                  Devvrat Hans
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />
                  {post.readTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyToClipboard(shareUrl, "Link copied")} className={shareBtn} aria-label="Copy link to this post">
                  <Link2 size={14} />
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareBtn}
                  aria-label="Share on X (opens in a new tab)"
                >
                  <XIcon size={13} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareBtn}
                  aria-label="Share on LinkedIn (opens in a new tab)"
                >
                  <LinkedinIcon size={13} />
                </a>
              </div>
            </div>

            {post.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="border border-hairline bg-canvas-soft px-2.5 py-0.5 font-mono text-[11px] text-mute">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </motion.header>

          <div className="mt-12">
            {post.headings.length > 0 && <TableOfContents headings={post.headings} />}

            <div className="lg:flex lg:gap-14">
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                onClick={onArticleClick}
                className="blog-content min-w-0 flex-1 text-[16px] sm:text-[17px]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {post.headings.length > 0 && <SidebarToc headings={post.headings} />}
            </div>
          </div>

          <div className="mt-20 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
              <span className="font-mono text-xs text-mute">thanks for reading</span>
              <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
            </div>

            {(newerPost || olderPost) && (
              <nav aria-label="More posts" className="mt-10 grid gap-3 sm:grid-cols-2">
                {newerPost ? (
                  <PostNavCard post={newerPost} direction="newer" />
                ) : (
                  <span className="hidden sm:block" />
                )}
                {olderPost && <PostNavCard post={olderPost} direction="older" />}
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function PostNavCard({ post, direction }: { post: BlogPost; direction: "newer" | "older" }) {
  const older = direction === "older";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`card-elevated card-hover group border border-hairline bg-canvas-soft p-5 ${older ? "sm:text-right" : ""}`}
    >
      <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mute ${older ? "sm:justify-end" : ""}`}>
        {!older && <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />}
        {older ? "Older post" : "Newer post"}
        {older && <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />}
      </span>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-ink-light transition-colors group-hover:text-accent">
        {post.title}
      </p>
    </Link>
  );
}
