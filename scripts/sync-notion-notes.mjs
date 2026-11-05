/**
 * Syncs published notes from a Notion database into content/notes/*.md, which /notes renders.
 *
 * Runs before `next build`, and on demand with `bun run notes:sync` (add `--force` to re-fetch
 * every note, not just the ones edited since the last sync). Notes are written as Markdown
 * with frontmatter, so the build never depends on Notion being reachable: without credentials,
 * or when Notion fails, the notes already in content/notes/ ship as they are.
 *
 * The scheduled publish workflow (.github/workflows/publish-notes.yml) adds `--strict`, which
 * turns those quiet skips into a failed run, so a sync that stops working gets noticed.
 *
 * Needs, in .env.local (setup steps in README.md, "Notes from Notion"):
 *   NOTION_TOKEN               internal integration secret (starts with ntn_)
 *   NOTION_NOTES_DATABASE_ID   the notes database id, or just paste its URL
 *
 * Only pages you mark as published are synced: a "Published" checkbox that is ticked, or a
 * "Status" (status or select) set to "Published". Everything else in the database stays private.
 * Optional properties, matched by name, ignoring case:
 *   Date (date)                     publish date; defaults to when the page was created
 *   Tags (multi-select)             shown as #tags
 *   Slug (text)                     URL slug; defaults to the title
 *   Summary / Excerpt / Description (text)   list excerpt; defaults to the first paragraph
 *
 * Images and files uploaded to Notion live behind links that expire after an hour, so they are
 * downloaded into public/notes-media/<slug>/ and the Markdown points at the local copy.
 * Hand-written notes (any .md in content/notes/ without `source: notion`) are never touched.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTES_DIR = path.join(ROOT, "content", "notes");
const MEDIA_DIR = path.join(ROOT, "public", "notes-media");
const NOTION_VERSION = "2026-03-11";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const FORCE = process.argv.includes("--force");
const STRICT = process.argv.includes("--strict");
/** Exit code when the sync can't run. Only --strict treats that as a failure. */
const SKIPPED = STRICT ? 1 : 0;
const log = (msg) => console.log(`[sync-notion-notes] ${msg}`);
const warn = (msg) => console.warn(`[sync-notion-notes] ${msg}`);

// ── Config ────────────────────────────────────────────────────────────────────────────────

/** process.env first, then .env.local / .env, the same lookup as fetch-github-charts.mjs. */
function readEnv(name) {
  if (process.env[name]) return process.env[name].trim();
  for (const file of [".env.local", ".env"]) {
    const envPath = path.join(ROOT, file);
    if (!fs.existsSync(envPath)) continue;
    const match = fs.readFileSync(envPath, "utf-8").match(new RegExp(`^${name}=(.*)$`, "m"));
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}

/** Accepts a raw id (with or without dashes) or a Notion URL, where the id is the last 32-hex run. */
function parseNotionId(input) {
  const ids = input.split("?")[0].replace(/-/g, "").match(/[0-9a-f]{32}/gi);
  if (!ids) return null;
  const id = ids[ids.length - 1].toLowerCase();
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

const TOKEN = readEnv("NOTION_TOKEN");
const DATABASE_INPUT = readEnv("NOTION_NOTES_DATABASE_ID");

if (!TOKEN || !DATABASE_INPUT) {
  log("NOTION_TOKEN or NOTION_NOTES_DATABASE_ID not set, skipping. Using the notes already in content/notes/.");
  process.exit(SKIPPED);
}

const DATABASE_ID = parseNotionId(DATABASE_INPUT);
if (!DATABASE_ID) {
  warn(`NOTION_NOTES_DATABASE_ID doesn't contain a Notion id: "${DATABASE_INPUT}". Skipping.`);
  process.exit(SKIPPED);
}

// ── Notion API ────────────────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** One API call, retrying rate limits (429) and transient server errors. */
async function notion(endpoint, { method = "GET", body } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 800 * 2 ** attempt);
      continue;
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(`${method} ${endpoint}: HTTP ${res.status}${json.message ? `, ${json.message}` : ""}`);
      err.status = res.status;
      throw err;
    }
    return json;
  }
}

/** Every result of a paginated list endpoint. */
async function paginate(fetchPage) {
  const results = [];
  let cursor;
  do {
    const page = await fetchPage(cursor);
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

/**
 * Databases hold one or more data sources (Notion-Version 2025-09-03 onwards); pages and the
 * property schema live on the data source. The configured id may be either kind.
 */
async function resolveDataSource(id) {
  try {
    const db = await notion(`/databases/${id}`);
    const sources = db.data_sources ?? [];
    if (!sources.length) throw new Error("The database has no data sources.");
    if (sources.length > 1) warn(`The database has ${sources.length} data sources; syncing the first, "${sources[0].name}".`);
    return await notion(`/data_sources/${sources[0].id}`);
  } catch (err) {
    if (err.status !== 404 && err.status !== 400) throw err;
    return notion(`/data_sources/${id}`);
  }
}

const childrenOf = (blockId) =>
  paginate((cursor) => notion(`/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`));

/** A page's blocks, with nested children loaded into `block.children`. */
async function loadBlocks(blockId) {
  const blocks = await childrenOf(blockId);
  for (const block of blocks) {
    if (!block.has_children || block.type === "child_page" || block.type === "child_database") continue;
    // A synced copy shows the original block's content.
    const source = block.type === "synced_block" ? (block.synced_block.synced_from?.block_id ?? block.id) : block.id;
    block.children = await loadBlocks(source);
  }
  return blocks;
}

// ── Properties ────────────────────────────────────────────────────────────────────────────

const plain = (rich) => (rich ?? []).map((t) => t.plain_text).join("");

const slugify = (text) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");

/** Finds the schema property to read for each field, by name (any case) and type. */
function mapSchema(properties) {
  const all = Object.values(properties);
  const find = (names, types) => all.find((p) => names.includes(p.name.trim().toLowerCase()) && types.includes(p.type));
  return {
    title: all.find((p) => p.type === "title"),
    published: find(["published", "public"], ["checkbox"]),
    status: find(["status"], ["status", "select"]),
    date: find(["date", "published on", "publish date"], ["date"]),
    tags: find(["tags", "tag", "topics"], ["multi_select"]),
    slug: find(["slug"], ["rich_text"]),
    excerpt: find(["summary", "excerpt", "description"], ["rich_text"]),
  };
}

/** The query filter that keeps unpublished pages out, or null when the database has no way to mark them. */
function publishedFilter(schema) {
  if (schema.published) return { property: schema.published.name, checkbox: { equals: true } };
  if (schema.status) {
    const options = schema.status[schema.status.type]?.options ?? [];
    const option = options.find((o) => o.name.trim().toLowerCase() === "published");
    if (option) return { property: schema.status.name, [schema.status.type]: { equals: option.name } };
  }
  return null;
}

// ── Markdown ──────────────────────────────────────────────────────────────────────────────

/** Backslash-escapes characters Markdown would otherwise treat as formatting. */
const escapeMd = (text) => text.replace(/([\\`*_[\]<>~|])/g, "\\$1");

/** Stops a line of prose from starting a heading, list, quote or rule ("2026. was a year" isn't a list). */
const escapeLineStarts = (text) =>
  text
    .split("\n")
    .map((line) => line.replace(/^(\s*)(\d{1,9})([.)])(\s)/, "$1$2\\$3$4").replace(/^(\s*)([#>+-])(\s|$)/, "$1\\$2$3"))
    .join("\n");

/** Link destinations can't hold spaces or unbalanced parentheses. */
const safeUrl = (url) => url.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");

/** Keeps edge whitespace outside emphasis markers: "**bold **" doesn't render, " **bold**" does. */
function wrap(text, marker) {
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return m[2] ? `${m[1]}${marker}${m[2]}${marker}${m[3]}` : text;
}

function codeSpan(text) {
  const fence = text.includes("`") ? "``" : "`";
  return `${fence}${text.includes("`") ? ` ${text} ` : text}${fence}`;
}

/**
 * Rich text to inline Markdown. Links to other synced notes become site links; links and
 * mentions of private Notion pages turn into plain text, since visitors couldn't open them.
 */
function richText(rich, ctx) {
  return (rich ?? [])
    .map((t) => {
      const raw = t.type === "equation" ? t.equation.expression : t.plain_text;
      if (!raw) return "";
      const a = t.annotations ?? {};
      let text = a.code || t.type === "equation" ? codeSpan(raw) : escapeMd(raw);
      if (a.bold) text = wrap(text, "**");
      if (a.italic) text = wrap(text, "_");
      if (a.strikethrough) text = wrap(text, "~~");

      const mentioned = t.type === "mention" ? (t.mention.page?.id ?? t.mention.database?.id) : null;
      const href = t.href ?? null;
      const target = noteLink(mentioned ?? href, ctx);
      if (target) return `[${text}](${target})`;
      if (t.type === "mention" && t.mention.type !== "link_preview" && t.mention.type !== "link_mention") return text;
      // Private notion.so pages are useless to visitors; public notion.site pages are fine.
      if (href && /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?notion\.so\//.test(href)) return `[${text}](${safeUrl(href)})`;
      return text;
    })
    .join("");
}

/** "/notes/<slug>/" when `ref` (an id, or a URL containing one) points at another synced note. */
function noteLink(ref, ctx) {
  if (!ref) return null;
  const id = parseNotionId(ref);
  const slug = id && ctx.slugById.get(id);
  return slug ? `/notes/${slug}/` : null;
}

const indentLines = (text, pad) => text.split("\n").map((l) => (l ? pad + l : l)).join("\n");
const quoteLines = (text) => text.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n");

/** Converts blocks to Markdown. List items in a row stay in one tight list. */
async function blocksToMd(blocks, ctx) {
  const chunks = [];
  let prevList = null;
  for (const block of blocks ?? []) {
    const md = await blockToMd(block, ctx);
    if (md == null || md === "") {
      prevList = null;
      continue;
    }
    const list = ["bulleted_list_item", "numbered_list_item", "to_do"].includes(block.type) ? block.type : null;
    if (list && list === prevList) chunks[chunks.length - 1] += `\n${md}`;
    else chunks.push(md);
    prevList = list;
  }
  return chunks.join("\n\n");
}

async function blockToMd(block, ctx) {
  const value = block[block.type] ?? {};
  const text = () => escapeLineStarts(richText(value.rich_text, ctx));
  const children = async () => (block.children ? await blocksToMd(block.children, ctx) : "");
  // Heading levels shift down one: the note's title is the page's only h1.
  const heading = async (hashes) => {
    const body = await children(); // toggleable headings carry their content as children
    return `${hashes} ${text()}${body ? `\n\n${body}` : ""}`;
  };
  const listItem = async (marker) => {
    const body = await children();
    return `${marker}${text()}${body ? `\n${indentLines(body, " ".repeat(marker.length))}` : ""}`;
  };

  switch (block.type) {
    case "paragraph": {
      const body = await children();
      return [text(), body].filter(Boolean).join("\n\n");
    }
    case "heading_1":
      return heading("##");
    case "heading_2":
      return heading("###");
    case "heading_3":
      return heading("####");
    case "bulleted_list_item":
      return listItem("- ");
    case "numbered_list_item":
      return listItem("1. ");
    case "to_do":
      return listItem(value.checked ? "- ☑ " : "- ☐ ");
    case "toggle": {
      const body = await children();
      return [`**${text()}**`, body].filter(Boolean).join("\n\n");
    }
    case "quote": {
      const body = await children();
      return quoteLines([text(), body].filter(Boolean).join("\n\n"));
    }
    case "callout": {
      const icon = value.icon?.type === "emoji" ? `${value.icon.emoji} ` : "";
      const body = await children();
      return quoteLines([`${icon}${text()}`, body].filter(Boolean).join("\n\n"));
    }
    case "code": {
      const code = plain(value.rich_text);
      const fence = code.includes("```") ? "~~~~" : "```";
      const lang = value.language && value.language !== "plain text" ? value.language.replace(/\s+/g, "-") : "";
      return `${fence}${lang}\n${code}\n${fence}`;
    }
    case "equation":
      return `\`\`\`tex\n${value.expression}\n\`\`\``;
    case "divider":
      return "---";
    case "image": {
      const src = await mediaUrl(value, ctx);
      if (!src) return null;
      const caption = plain(value.caption);
      return `![${escapeMd(caption || "Image")}](${safeUrl(src)}${caption ? ` "${caption.replace(/"/g, "'")}"` : ""})`;
    }
    case "video":
    case "audio":
    case "file":
    case "pdf": {
      const src = await mediaUrl(value, ctx);
      if (!src) return null;
      const label = plain(value.caption) || value.name || decodeURIComponent(src.split("/").pop() ?? block.type);
      return `[${escapeMd(label)}](${safeUrl(src)})`;
    }
    case "bookmark":
    case "embed":
    case "link_preview": {
      if (!value.url) return null;
      const label = plain(value.caption) || value.url;
      return `[${escapeMd(label)}](${safeUrl(value.url)})`;
    }
    case "link_to_page": {
      const id = value.page_id ?? value.database_id;
      const slug = id && ctx.slugById.get(id);
      return slug ? `[${escapeMd(ctx.titleById.get(id) ?? slug)}](/notes/${slug}/)` : null;
    }
    case "table":
      return tableToMd(block, ctx);
    case "column_list":
    case "column":
    case "synced_block":
      return children();
    default:
      // child_page, child_database, table_of_contents, breadcrumb, unsupported, ...
      return null;
  }
}

function tableToMd(block, ctx) {
  const rows = (block.children ?? []).filter((r) => r.type === "table_row");
  if (!rows.length) return null;
  const cell = (rich) => richText(rich, ctx).replace(/\n/g, " ") || " ";
  const lines = rows.map((r) => `| ${r.table_row.cells.map(cell).join(" | ")} |`);
  const width = rows[0].table_row.cells.length;
  // Markdown tables always have a header row; Notion tables without one get an empty header.
  const separator = `|${" --- |".repeat(width)}`;
  if (block.table?.has_column_header) return [lines[0], separator, ...lines.slice(1)].join("\n");
  return [`|${"   |".repeat(width)}`, separator, ...lines].join("\n");
}

/**
 * The URL to use for an image or file block. Notion-hosted files are downloaded (their links
 * expire); external links are kept as they are.
 */
async function mediaUrl(value, ctx) {
  if (value.type === "external") return value.external?.url ?? null;
  const url = value.file?.url;
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_FILE_BYTES) {
      warn(`  left a file out of "${ctx.title}": it's larger than ${MAX_FILE_BYTES / 1024 / 1024} MB.`);
      return null;
    }
    const ext = path.extname(new URL(url).pathname).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
    const name = `${String(++ctx.mediaCount).padStart(2, "0")}${ext}`;
    ctx.media.push({ name, buf });
    return `/notes-media/${ctx.slug}/${name}`;
  } catch (err) {
    // Usually a network hiccup, so the note is fetched again next sync rather than being
    // marked up to date without the file.
    ctx.retry = true;
    warn(`  could not download a file in "${ctx.title}" (${err.message}); leaving it out until the next sync.`);
    return null;
  }
}

// ── Sync ──────────────────────────────────────────────────────────────────────────────────

/** Notes already on disk, keyed by Notion page id (synced ones) plus every slug in use. */
function readExisting() {
  const synced = new Map();
  const handWritten = new Set();
  if (!fs.existsSync(NOTES_DIR)) return { synced, handWritten };
  for (const file of fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(NOTES_DIR, file), "utf-8"));
    // YAML may hand timestamps back as Date objects; compare them as Notion's ISO strings.
    const lastEdited = data.lastEdited instanceof Date ? data.lastEdited.toISOString() : data.lastEdited;
    if (data.source === "notion" && data.notionId) synced.set(data.notionId, { slug, lastEdited });
    else handWritten.add(slug);
  }
  return { synced, handWritten };
}

function firstParagraph(markdown) {
  const para = markdown
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|>|```|~~~|- |1\. |\||!\[|---)/.test(p));
  if (!para) return "";
  const text = para
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\([\\`*_[\]<>~|])/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 180 ? `${text.slice(0, 177).replace(/\s+\S*$/, "")}…` : text;
}

const readTime = (markdown) =>
  `${Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 200))} min read`;

async function main() {
  const dataSource = await resolveDataSource(DATABASE_ID);
  const schema = mapSchema(dataSource.properties ?? {});
  const filter = publishedFilter(schema);
  if (!filter) {
    warn(
      'The notes database has no way to mark a note as published. Add a checkbox property called "Published" ' +
        '(or a Status option called "Published"), tick it on the notes you want public, and run this again. Nothing was synced.'
    );
    process.exitCode = SKIPPED;
    return;
  }

  const pages = (
    await paginate((cursor) =>
      notion(`/data_sources/${dataSource.id}/query`, {
        method: "POST",
        body: {
          filter,
          sorts: schema.date
            ? [{ property: schema.date.name, direction: "descending" }]
            : [{ timestamp: "created_time", direction: "descending" }],
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        },
      })
    )
  ).filter((p) => p.object === "page" && !p.in_trash);

  const { synced, handWritten } = readExisting();

  // Pass 1: titles and slugs, so notes can link to each other while converting.
  const used = new Set(handWritten);
  const notes = pages.map((page) => {
    const props = page.properties;
    const title = plain(schema.title && props[schema.title.name]?.title).trim() || "Untitled";
    let slug = slugify(schema.slug ? plain(props[schema.slug.name]?.rich_text) : "") || slugify(title) || page.id.slice(0, 8);
    if (used.has(slug)) slug = `${slug}-${page.id.replace(/-/g, "").slice(0, 6)}`;
    used.add(slug);
    return { page, title, slug };
  });
  const slugById = new Map(notes.map((n) => [n.page.id, n.slug]));
  const titleById = new Map(notes.map((n) => [n.page.id, n.title]));

  // Links between notes are baked into each note's Markdown, so when a note is published,
  // unpublished or renamed, every note is converted again instead of reusing unchanged ones.
  const linksChanged = notes.length !== synced.size || notes.some((n) => synced.get(n.page.id)?.slug !== n.slug);

  // Pass 2: content. Nothing is written until every note has been fetched, so a failure halfway
  // through leaves the previous sync intact.
  const outputs = [];
  let reused = 0;
  for (const { page, title, slug } of notes) {
    const previous = synced.get(page.id);
    if (!FORCE && !linksChanged && previous && previous.lastEdited === page.last_edited_time) {
      reused++;
      continue;
    }
    const ctx = { slug, title, slugById, titleById, media: [], mediaCount: 0 };
    const body = await blocksToMd(await loadBlocks(page.id), ctx);
    const props = page.properties;
    const data = {
      title,
      date: (schema.date && props[schema.date.name]?.date?.start?.slice(0, 10)) || page.created_time.slice(0, 10),
      updated: page.last_edited_time.slice(0, 10),
      tags: schema.tags ? (props[schema.tags.name]?.multi_select ?? []).map((o) => o.name) : [],
      excerpt: (schema.excerpt && plain(props[schema.excerpt.name]?.rich_text).trim()) || firstParagraph(body),
      readTime: readTime(body),
      source: "notion",
      notionId: page.id,
      // Left out when a file failed to download, so the next sync fetches this note again.
      ...(ctx.retry ? {} : { lastEdited: page.last_edited_time }),
    };
    outputs.push({ slug, previousSlug: previous?.slug, data, body, media: ctx.media });
    log(`  ${previous ? "updated" : "added"}  ${slug}`);
  }

  // Write. Synced notes that were unpublished, deleted or renamed are removed with their media.
  // Both folders always exist after a sync, so the publish workflow can `git add` them by name.
  fs.mkdirSync(NOTES_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  const keep = new Set(notes.map((n) => n.slug));
  for (const [, { slug }] of synced) {
    if (keep.has(slug) && !outputs.some((o) => o.previousSlug === slug && o.slug !== slug)) continue;
    fs.rmSync(path.join(NOTES_DIR, `${slug}.md`), { force: true });
    fs.rmSync(path.join(MEDIA_DIR, slug), { recursive: true, force: true });
    if (!keep.has(slug)) log(`  removed  ${slug}`);
  }
  for (const { slug, data, body, media } of outputs) {
    const mediaDir = path.join(MEDIA_DIR, slug);
    fs.rmSync(mediaDir, { recursive: true, force: true });
    if (media.length) {
      fs.mkdirSync(mediaDir, { recursive: true });
      for (const { name, buf } of media) fs.writeFileSync(path.join(mediaDir, name), buf);
    }
    fs.writeFileSync(path.join(NOTES_DIR, `${slug}.md`), matter.stringify(`${body}\n`, data), "utf-8");
  }

  log(`Synced ${notes.length} published note${notes.length === 1 ? "" : "s"} (${outputs.length} fetched, ${reused} unchanged).`);
}

try {
  await main();
} catch (err) {
  const hint =
    err.status === 401
      ? " Check NOTION_TOKEN."
      : err.status === 404 || err.status === 400
        ? " Check NOTION_NOTES_DATABASE_ID, and that the database is shared with your integration (••• menu → Connections)."
        : "";
  warn(`Failed: ${err.message.replace(/\.$/, "")}.${hint} Keeping the notes already in content/notes/.`);
  // A build never fails over notes (the last successful sync still ships); a --strict run does.
  process.exit(SKIPPED);
}
