import { getAllPosts } from "@/lib/blog-data";
import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-static";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogPageClient posts={posts} />;
}
