// Content for the real-me side: the Aback journey and the products. The /me page, the command
// palette and the terminal all read from here, so a new milestone or launch is a one-file edit.
import type { Preview } from "@/components/PreviewWindow";

export const ABACK = {
  group: { name: "Aback Group", href: "https://aback.group", domain: "aback.group" },
  consultancy: { name: "Aback.ai", href: "https://aback.ai", domain: "aback.ai" },
} as const;

export interface Product {
  name: string;
  tagline: string;
  /** "live" products link out; "soon" renders as a placeholder that points at the newsletter. */
  status: "live" | "soon";
  href?: string;
  category: string;
  points: string[];
  /** One headline number for the card footer. */
  stat?: { value: string; label: string };
  preview?: Preview;
}

export const PRODUCTS: Product[] = [
  {
    name: "Aback Tools",
    tagline: "Convert files, format content, and get things done in your browser.",
    status: "live",
    href: "https://abacktools.com",
    category: "Utilities",
    points: [
      "3,000+ free tools for images, PDFs, files, code and SEO",
      "No installation and no signup, ever",
      "56K new users and 32.4K Google clicks in October 2026",
    ],
    stat: { value: "3,000+", label: "free browser tools" },
    preview: {
      title: "abacktools.com",
      lines: [
        [["prompt", "› "], ["cmd", "png to webp"]],
        [["mute", "  ▸ drop  "], ["accent", "screenshot.png"]],
        [["mute", "  ▸ convert in the browser"]],
        [["ok", "  ✓ "], ["mute", "done · no install · no signup"]],
      ],
    },
  },
  {
    name: "Aback Launch",
    tagline: "Launch once. Get found for years.",
    status: "live",
    href: "https://abacklaunch.com",
    category: "Launches",
    points: [
      "A weekly launch list, ranked by member upvotes",
      "A permanent, crawlable page for every product",
      "Free submissions, each reviewed by a real person",
    ],
    stat: { value: "DR 44", label: "domain rating" },
    preview: {
      title: "abacklaunch.com",
      lines: [
        [["prompt", "› "], ["cmd", "submit yourproduct.com"]],
        [["mute", "  ▸ reviewed by a real person"]],
        [["mute", "  ▸ goes live "], ["accent", "Friday 00:00 UTC"]],
        [["ok", "  ✓ "], ["mute", "ranked by upvotes · page kept for good"]],
      ],
    },
  },
  {
    name: "Product 03",
    tagline: "Not announced yet. Newsletter readers hear about it first.",
    status: "soon",
    category: "Coming soon",
    points: [],
  },
];

export interface Milestone {
  /** Display label, e.g. "Jun 2025" or "Now". */
  date: string;
  /** Short kind label shown above the title. */
  tag: string;
  title: string;
  body: string;
  points?: string[];
  link?: { label: string; href: string };
  /** Marks the live, still-being-written milestone (gets the accent node). */
  current?: boolean;
}

// Oldest first. Keep the copy in first person: this side of the site is the unpolished one.
export const JOURNEY: Milestone[] = [
  {
    date: "Jun 2025",
    tag: "Start",
    title: "Joined the founder's office at Aback.ai",
    body: "I started working directly with the founders on technology. The job was easy to describe and hard to do: take an idea from a conversation to something running in production.",
    points: [
      "Led architecture, AI integration and deployment across early products",
      "Built invoice, inventory, AI recruitment and Aback Terminal modules",
      "Worked on QRliee, which handled 7,000+ scans at Bharat Innovate",
    ],
  },
  {
    date: "2025",
    tag: "Launch",
    title: "Shipped AbackTools.com",
    body: "A free tools site that runs in the browser. No installs, no signup, just the tool you came for. It found its audience early, at around 500 clicks a day.",
    link: { label: "abacktools.com", href: "https://abacktools.com" },
  },
  {
    date: "2026",
    tag: "Structure",
    title: "Aback became a group",
    body: "We split products from services. Aback Group became the home for our own products, each on its own domain. Aback.ai stayed the consultancy arm that builds custom software for clients.",
    link: { label: "aback.group", href: "https://aback.group" },
  },
  {
    date: "Oct 2026",
    tag: "Launch",
    title: "Aback Launch went live",
    body: "A weekly launch platform for startups and indie makers. New products go live every Friday, members upvote through the week, and every product keeps a permanent page that keeps getting found.",
    points: [
      "42 products launched and 898 members joined by week two",
      "Links are earned, not bought: no paid dofollow links or votes",
    ],
    link: { label: "abacklaunch.com", href: "https://abacklaunch.com" },
  },
  {
    date: "Oct 2026",
    tag: "Milestone",
    title: "AbackTools passed 56K new users in a month",
    body: "October in numbers: 56K new users, 67K sessions and 82K views. Google sent 32.4K clicks from 2.44M impressions. New users grew 174% over the previous period.",
  },
  {
    date: "Now",
    tag: "Now",
    title: "Building what comes next",
    body: "More products are in the works. I write about how each one gets built, what works and what doesn't, here and in the newsletter.",
    link: { label: "Get the newsletter", href: "/newsletter" },
    current: true,
  },
];
