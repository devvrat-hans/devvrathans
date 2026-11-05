import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isoDate, renderMarkdown, type TocEntry } from "./markdown";

export type { TocEntry } from "./markdown";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string;
  headings: TocEntry[];
}

function getPostsDirectory(): string {
  return path.join(process.cwd(), "content", "blog");
}

export function getAllPosts(): BlogPost[] {
  const postsDir = getPostsDirectory();
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(postsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const { html, headings } = renderMarkdown(content);

      return {
        slug,
        title: data.title || slug,
        date: isoDate(data.date),
        readTime: data.readTime || "5 min read",
        tags: data.tags || [],
        excerpt: data.excerpt || "",
        content: html,
        headings,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
