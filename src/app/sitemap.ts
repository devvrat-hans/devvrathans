import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-data";
import { getNoteSummaries } from "@/lib/notes-data";
import { SITE_URL } from "@/lib/seo";

// Emitted as out/sitemap.xml by the static export. Paths keep the trailing slash (trailingSlash: true).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string) => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    // Portfolio side
    page("/"),
    page("/resume/"),
    // Real-me side
    page("/me/"),
    page("/blog/"),
    page("/notes/"),
    page("/newsletter/"),
    page("/x/"),
    ...getAllPosts().map((p) => page(`/blog/${p.slug}/`, p.date)),
    ...getNoteSummaries().map((n) => page(`/notes/${n.slug}/`, n.updated)),
  ];
}
