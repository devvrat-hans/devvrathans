import { getAllPosts } from "@/lib/blog-data";
import { pageMetadata } from "@/lib/seo";
import NewsletterPageClient from "./NewsletterPageClient";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Newsletter | Devvrat Hans",
  socialTitle: "The Aback newsletter, every other week",
  description:
    "A biweekly email from Devvrat Hans: what shipped at Aback, real traffic and growth numbers, and the best notes and links from the past two weeks.",
  path: "/newsletter/",
  image: "me",
});

export default function NewsletterPage() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, date }) => ({ slug, title, date }));
  return <NewsletterPageClient posts={posts} />;
}
