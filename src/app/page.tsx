import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import { SITE_DESCRIPTION, SITE_TITLE, homeJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    // .rails draws the two vertical hairlines that frame every section on wide screens
    <main className="rails">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homeJsonLd()) }} />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <GitHubActivity />
      <Contact />
    </main>
  );
}
