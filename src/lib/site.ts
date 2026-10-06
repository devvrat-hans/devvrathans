// Single source of truth for links shared by the nav, hero, contact, footer and command palette.

export const EMAIL = "devvrat.coding@gmail.com";

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

export const ROUTES = [
  { href: "/resume", label: "Resume" },
  { href: "/blog", label: "Blog" },
] as const;
