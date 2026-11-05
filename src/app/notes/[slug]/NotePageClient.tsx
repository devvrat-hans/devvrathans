"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Link2, NotebookPen } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import SidebarToc from "@/components/SidebarToc";
import NewsletterCard from "@/components/NewsletterCard";
import { copyToClipboard } from "@/components/Toaster";
import { XIcon } from "@/components/icons";
import type { Note } from "@/lib/notes-data";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

type Neighbour = { slug: string; title: string } | null;

export default function NotePageClient({ note, newer, older }: { note: Note; newer: Neighbour; older: Neighbour }) {
  const shareUrl = `${SITE_URL}/notes/${note.slug}/`;
  const showToc = note.headings.length > 1;

  // Delegated handler for the server-rendered note HTML: code-block copy buttons.
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
        <div className={`mx-auto ${showToc ? "max-w-5xl" : "max-w-3xl"}`}>
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Link
              href="/notes"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-mute transition-colors hover:text-ink-light"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              All notes
            </Link>

            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent">
              <NotebookPen size={12} aria-hidden="true" />
              Note
            </div>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] text-ink-light text-balance sm:text-[2.75rem]">
              {note.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-3.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
                <time dateTime={note.date}>{formatDate(note.date)}</time>
                {note.updated && note.updated !== note.date && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Updated <time dateTime={note.updated}>{formatDate(note.updated)}</time>
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />
                  {note.readTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyToClipboard(shareUrl, "Link copied")} className={shareBtn} aria-label="Copy link to this note">
                  <Link2 size={14} />
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(note.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareBtn}
                  aria-label="Share on X (opens in a new tab)"
                >
                  <XIcon size={13} />
                </a>
              </div>
            </div>

            {note.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
                {note.tags.map((tag) => (
                  <li key={tag} className="border border-hairline bg-canvas-soft px-2.5 py-0.5 font-mono text-[11px] text-mute">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </motion.header>

          <div className="mt-10">
            {showToc && <TableOfContents headings={note.headings} />}

            <div className="lg:flex lg:gap-14">
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                onClick={onArticleClick}
                className="blog-content min-w-0 flex-1 text-[16px] sm:text-[17px]"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              {showToc && <SidebarToc headings={note.headings} />}
            </div>
          </div>

          <div className="mt-20 max-w-3xl">
            <NewsletterCard source={`note:${note.slug}`} title="Liked this note?" />

            {(newer || older) && (
              <nav aria-label="More notes" className="mt-10 grid gap-3 sm:grid-cols-2">
                {newer ? <NoteNavCard note={newer} direction="newer" /> : <span className="hidden sm:block" />}
                {older && <NoteNavCard note={older} direction="older" />}
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NoteNavCard({ note, direction }: { note: { slug: string; title: string }; direction: "newer" | "older" }) {
  const older = direction === "older";
  return (
    <Link
      href={`/notes/${note.slug}`}
      className={`card-elevated card-hover group border border-hairline bg-canvas-soft p-5 ${older ? "sm:text-right" : ""}`}
    >
      <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mute ${older ? "sm:justify-end" : ""}`}>
        {!older && <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />}
        {older ? "Older note" : "Newer note"}
        {older && <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />}
      </span>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-ink-light transition-colors group-hover:text-accent">{note.title}</p>
    </Link>
  );
}
