import "server-only";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Renders Markdown for `.blog-content`: h2/h3 get ids plus a hover "#" permalink (and are
 * returned as a table of contents), and code blocks are wrapped so they can carry a copy button.
 * Used by both the blog and the notes.
 */
export function renderMarkdown(source: string): { html: string; headings: TocEntry[] } {
  const rendered = md.render(source);

  const headings: TocEntry[] = [];
  const seen = new Map<string, number>();
  let html = rendered;

  const headingRegex = /<h([23])>([^<]+)<\/h\1>/g;
  let match;
  while ((match = headingRegex.exec(rendered)) !== null) {
    const level = parseInt(match[1]);
    const rawText = match[2].replace(/<[^>]+>/g, "");
    const base =
      rawText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || "section";
    // Repeated headings get -2, -3… so every anchor stays unique.
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    headings.push({ id, text: rawText, level });
    // Hover-revealed "#" permalink after each heading (styled by .heading-anchor).
    html = html.replace(
      match[0],
      `<h${level} id="${id}">${match[2]}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`
    );
  }

  // Wrap code blocks so they can carry a copy button (wired up by the page's click handler).
  html = html
    .replace(/<pre>/g, `<div class="code-block"><button type="button" class="code-copy" data-copy-code>Copy</button><pre>`)
    .replace(/<\/pre>/g, "</pre></div>");

  return { html, headings };
}

/** "≈ 1 min read" from the raw Markdown, at 200 words a minute. */
export function readTime(source: string): string {
  const words = source.replace(/[#>*_`~[\]()!|-]/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** gray-matter turns unquoted YAML dates into Date objects; normalise them back to "YYYY-MM-DD". */
export function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}
