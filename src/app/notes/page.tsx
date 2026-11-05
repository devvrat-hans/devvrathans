import { getNoteSummaries } from "@/lib/notes-data";
import { pageMetadata } from "@/lib/seo";
import NotesPageClient from "./NotesPageClient";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Notes | Devvrat Hans",
  description: "Short, unpolished notes from Devvrat Hans: building products, SEO, growth, AI workflows and things worth remembering.",
  path: "/notes/",
  image: "me",
});

export default function NotesPage() {
  return <NotesPageClient notes={getNoteSummaries()} />;
}
