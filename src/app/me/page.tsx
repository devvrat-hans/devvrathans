import type { Metadata } from "next";
import MeHero from "@/components/MeHero";
import Journey from "@/components/Journey";
import AbackProducts from "@/components/AbackProducts";
import Writing from "@/components/Writing";
import NewsletterSection from "@/components/NewsletterSection";
import MeContact from "@/components/MeContact";
import { getAllPosts } from "@/lib/blog-data";
import { getNoteSummaries } from "@/lib/notes-data";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Devvrat Hans | Building Aback in public",
  socialTitle: "Building Aback, in public",
  description:
    "The other side of Devvrat Hans: building Aback Group, the products behind it (Aback Tools, Aback Launch), real numbers, writing, notes and a biweekly newsletter.",
  path: "/me/",
  image: "me",
});

export default function MePage() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, date, readTime, excerpt }) => ({ slug, title, date, readTime, excerpt }));
  const notes = getNoteSummaries()
    .slice(0, 6)
    .map(({ slug, title, date, tags }) => ({ slug, title, date, tags }));

  return (
    // Same page frame as the portfolio home: rails on wide screens, one divider per section
    <main className="rails">
      <MeHero />
      <Journey />
      <AbackProducts />
      <Writing posts={posts} notes={notes} />
      <NewsletterSection />
      <MeContact />
    </main>
  );
}
