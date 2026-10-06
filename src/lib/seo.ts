// Single source of truth for page metadata: titles, descriptions, social cards, canonical URLs
// and structured data. Pages build their metadata with `pageMetadata()` so every route gets the
// full Open Graph / X card set (Next merges `openGraph` and `twitter` shallowly, so a page that
// sets only a title there would otherwise drop the image, locale and site name).
import type { Metadata } from "next";
import { SOCIALS } from "./site";

export const SITE_URL = "https://devvrathans.com";
export const SITE_NAME = "Devvrat Hans";
export const SITE_TITLE = "Devvrat Hans | Software Engineer & Builder";
export const SITE_DESCRIPTION =
  "Devvrat Hans, B.Tech CSE at IIT Gandhinagar. Software engineer building agentic AI, AI governance & evaluation tooling, and full-stack products.";

/** public/og.png, rendered at exactly this size by scripts/generate-og.mjs. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Devvrat Hans: software engineer building agentic AI, AI governance & evaluation tooling, and full-stack products",
};

const LOCALE = "en_US";
const X_HANDLE = SOCIALS.x.handle;

interface PageSeo {
  /** Document <title>. */
  title: string;
  description: string;
  /**
   * Route path with a trailing slash (next.config sets `trailingSlash: true`), resolved against
   * `metadataBase`. Becomes the canonical URL and og:url. Omit only for site-wide defaults.
   */
  path?: string;
  /** og:title / twitter:title, when the card should read differently from the <title>. */
  socialTitle?: string;
  /** Marks the page as an og:type=article. */
  article?: { publishedTime?: string; tags?: string[] };
}

export function pageMetadata({ title, description, path, socialTitle, article }: PageSeo): Metadata {
  const cardTitle = socialTitle ?? title;
  const og = {
    title: cardTitle,
    description,
    url: path,
    siteName: SITE_NAME,
    locale: LOCALE,
    images: [OG_IMAGE],
  };

  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: article
      ? {
          ...og,
          type: "article",
          publishedTime: article.publishedTime || undefined,
          authors: [`${SITE_URL}/`],
          tags: article.tags,
        }
      : { ...og, type: "website" },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      title: cardTitle,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}

/** schema.org graph for the home page: the site, the profile page, and the person it is about. */
export function homeJsonLd() {
  const home = `${SITE_URL}/`;
  const ids = { website: `${home}#website`, webpage: `${home}#webpage`, person: `${home}#person` };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: home,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": ids.person },
      },
      {
        "@type": "ProfilePage",
        "@id": ids.webpage,
        url: home,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": ids.website },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${OG_IMAGE.url}`,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
        },
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: SITE_NAME,
        url: home,
        jobTitle: "Software Engineer",
        description: SITE_DESCRIPTION,
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology Gandhinagar",
          url: "https://iitgn.ac.in",
        },
        knowsAbout: [
          "Agentic AI",
          "LLM systems",
          "AI governance",
          "AI evaluation",
          "Full-stack development",
          "TypeScript",
          "Rust",
          "Next.js",
        ],
        sameAs: Object.values(SOCIALS).map((s) => s.href),
      },
    ],
  };
}

/** Serialises JSON-LD for an inline <script>, escaping `<` so the payload can't close the tag. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
