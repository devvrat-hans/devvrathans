import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isoDate, readTime, renderMarkdown, type TocEntry } from "./markdown";

// Notes live in content/notes/*.md. Most are written in Notion and synced in by
// scripts/sync-notion-notes.mjs before every build; a hand-written .md works the same way.

export interface Note {
  slug: string;
  title: string;
  date: string;
  /** Last edit, "YYYY-MM-DD". Equals `date` for notes that were never edited after publishing. */
  updated: string;
  tags: string[];
  excerpt: string;
  readTime: string;
  content: string;
  headings: TocEntry[];
}

/** Everything the notes list needs, without the rendered body. */
export type NoteSummary = Omit<Note, "content" | "headings">;

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export function getAllNotes(): Note[] {
  if (!fs.existsSync(NOTES_DIR)) return [];

  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(NOTES_DIR, file), "utf-8"));
      const { html, headings } = renderMarkdown(content);
      const date = isoDate(data.date);

      return {
        slug,
        title: data.title || slug,
        date,
        updated: isoDate(data.updated) || date,
        tags: data.tags || [],
        excerpt: data.excerpt || "",
        readTime: data.readTime || readTime(content),
        content: html,
        headings,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function getNoteSummaries(): NoteSummary[] {
  return getAllNotes().map(({ slug, title, date, updated, tags, excerpt, readTime }) => ({
    slug,
    title,
    date,
    updated,
    tags,
    excerpt,
    readTime,
  }));
}

export function getNoteBySlug(slug: string): Note | null {
  return getAllNotes().find((n) => n.slug === slug) ?? null;
}
