import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog-data";
import { pageMetadata } from "@/lib/seo";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Blog | Devvrat Hans" };
  }

  return pageMetadata({
    title: `${post.title} | Devvrat Hans`,
    socialTitle: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    article: { publishedTime: post.date, tags: post.tags },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  return <BlogPostClient post={post} posts={allPosts} />;
}
