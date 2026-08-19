import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

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

      const renderedContent = md.render(content);

      // Extract headings and inject IDs into the HTML
      const headings: TocEntry[] = [];
      let contentWithIds = renderedContent;

      const headingRegex = /<h([23])>([^<]+)<\/h\1>/g;
      let match;
      while ((match = headingRegex.exec(renderedContent)) !== null) {
        const level = parseInt(match[1]);
        const rawText = match[2].replace(/<[^>]+>/g, "");
        const id = rawText
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
        headings.push({ id, text: rawText, level });
        contentWithIds = contentWithIds.replace(
          match[0],
          `<h${level} id="${id}">${match[2]}</h${level}>`
        );
      }

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        readTime: data.readTime || "5 min read",
        tags: data.tags || [],
        excerpt: data.excerpt || "",
        content: contentWithIds,
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
