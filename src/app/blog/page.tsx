import { getAllPosts } from "@/lib/blog-data";
import { pageMetadata } from "@/lib/seo";
import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Blog | Devvrat Hans",
  description: "Writing on building software, developer tools, AI, and the occasional life update.",
  path: "/blog/",
});

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogPageClient posts={posts} />;
}
