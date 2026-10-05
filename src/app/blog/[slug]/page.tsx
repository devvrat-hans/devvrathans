import { getAllPosts, getPostBySlug } from "@/lib/blog-data";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Blog - Devvrat Hans" };
  }

  return {
    title: `${post.title} - Devvrat Hans`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-body">Post not found.</p>
      </div>
    );
  }

  const allPosts = getAllPosts();
  return <BlogPostClient post={post} posts={allPosts} />;
}
