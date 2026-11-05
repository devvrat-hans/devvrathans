import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNotes, getNoteBySlug } from "@/lib/notes-data";
import { pageMetadata } from "@/lib/seo";
import NotePageClient from "./NotePageClient";

// Static export needs at least one path per dynamic route. Until the first note is synced,
// a single placeholder path renders the 404 page instead of failing the build.
const PLACEHOLDER = "_";

export function generateStaticParams() {
  const notes = getAllNotes();
  return notes.length ? notes.map((note) => ({ slug: note.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: "Notes | Devvrat Hans" };

  return pageMetadata({
    title: `${note.title} | Notes | Devvrat Hans`,
    socialTitle: note.title,
    description: note.excerpt || `A note by Devvrat Hans on ${note.tags.join(", ") || "building things"}.`,
    path: `/notes/${note.slug}/`,
    article: { publishedTime: note.date, tags: note.tags },
    image: "me",
  });
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  // Neighbours for the prev/next links, without shipping every note's body to the client.
  const all = getAllNotes();
  const i = all.findIndex((n) => n.slug === note.slug);
  const pick = (n?: (typeof all)[number]) => (n ? { slug: n.slug, title: n.title } : null);

  return <NotePageClient note={note} newer={pick(all[i - 1])} older={pick(all[i + 1])} />;
}
