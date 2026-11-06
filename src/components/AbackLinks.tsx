import { Fragment } from "react";

// Every way the copy names an Aback site, mapped to where it lives. Longer names come first so
// "AbackTools.com" wins over "AbackTools".
const SITES: [name: string, href: string][] = [
  ["Aback Group", "https://aback.group"],
  ["aback.group", "https://aback.group"],
  ["AbackTools.com", "https://abacktools.com"],
  ["abacktools.com", "https://abacktools.com"],
  ["Aback Tools", "https://abacktools.com"],
  ["AbackTools", "https://abacktools.com"],
  ["Aback Launch", "https://abacklaunch.com"],
  ["abacklaunch.com", "https://abacklaunch.com"],
  ["Aback.ai", "https://aback.ai"],
  ["aback.ai", "https://aback.ai"],
];
const HREFS = new Map(SITES);
const PATTERN = new RegExp(`(${SITES.map(([name]) => name.replace(/\./g, "\\.")).join("|")})`, "g");

/**
 * Plain text with every Aback site name turned into a link to that site. Only use it where the
 * text isn't already inside a link.
 */
export default function AbackLinks({ text }: { text: string }) {
  return text.split(PATTERN).map((part, i) => {
    const href = HREFS.get(part);
    if (!href) return <Fragment key={i}>{part}</Fragment>;
    return (
      <a
        key={i}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink-light underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
      >
        {part}
      </a>
    );
  });
}
