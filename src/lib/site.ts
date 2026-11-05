// Single source of truth for links shared by the nav, hero, contact, footer and command palette.

/** Shown on the portfolio side (recruiters, hiring). */
export const EMAIL = "devvrat.coding@gmail.com";
/** Shown on the real-me side (Aback, writing, notes, sponsorships). */
export const ME_EMAIL = "devvrat@aback.ai";

export const SOCIALS = {
  github: { label: "GitHub", handle: "devvrat-hans", href: "https://github.com/devvrat-hans" },
  linkedin: { label: "LinkedIn", handle: "devvrathans", href: "https://linkedin.com/in/devvrathans/" },
  x: { label: "X / Twitter", handle: "@DevvratHans", href: "https://x.com/DevvratHans" },
} as const;

/** Home-page sections, in scroll order. `id` matches the section element id. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
] as const;

/** Sections of the real-me home (/me), in scroll order. */
export const ME_SECTIONS = [
  { id: "journey", label: "Journey" },
  { id: "products", label: "Products" },
  { id: "writing", label: "Writing" },
  { id: "newsletter", label: "Newsletter" },
  { id: "say-hi", label: "Say hi" },
] as const;

export const ROUTES = [
  { href: "/resume", label: "Resume" },
  { href: "/blog", label: "Blog" },
] as const;

/**
 * The site has two versions. "portfolio" is the recruiter-facing site at /. "me" is the personal
 * side at /me: the Aback journey, products, writing, notes and X sponsorships. A page belongs to a
 * side by its path alone, so the nav, footer and command palette switch without stored state.
 */
export type Side = "portfolio" | "me";

const ME_PATHS = ["/me", "/blog", "/notes", "/newsletter", "/x"];

export function sideForPath(pathname: string): Side {
  return ME_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ? "me" : "portfolio";
}

export const SIDES = {
  portfolio: { label: "Portfolio", href: "/", email: EMAIL },
  me: { label: "Real me", href: "/me", email: ME_EMAIL },
} as const satisfies Record<Side, { label: string; href: string; email: string }>;
