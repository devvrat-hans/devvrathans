/**
 * Deploys out/ to the Cloudflare Pages project, tagged with the commit it was built from.
 *
 *   bun run deploy                          after `bun run build`
 *   node scripts/deploy-pages.mjs --check   in the publish-notes workflow, before it builds
 *
 * Cloudflare keeps two facts with every deploy: the commit, and whether the working tree had
 * uncommitted changes on top of it. Files the build rewrites by itself (heatmap snapshot, OG
 * images, icons, notes synced from Notion) and files that never reach the site (docs, the
 * Worker, editor and CI config) don't count, so building and deploying a pushed main is clean.
 *
 * The workflow deploys main, which would quietly undo anything live that main doesn't have.
 * So --check reads the live deploy first:
 *   - deployed from a commit that isn't on main yet: skip, and pick up again once it's pushed
 *   - no commit recorded at all (a dashboard upload): fail, since that never sorts itself out
 *   - main's notes match the live deploy's: nothing to publish
 *   - notes differ and the live deploy had nothing uncommitted: deploy
 *   - notes differ but the live deploy had uncommitted changes: fail, so you hear about it
 * --force skips all of that and deploys main. --check needs CLOUDFLARE_API_TOKEN and
 * CLOUDFLARE_ACCOUNT_ID, the same two variables wrangler reads in CI.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = "devvrathans";
const WRANGLER = path.join(ROOT, "node_modules", "wrangler", "bin", "wrangler.js");
const NOTES = ["content/notes", "public/notes-media"];
/** Uncommitted changes here don't make a deploy dirty. A trailing slash means the whole folder. */
const NOT_SOURCE = [
  // Rewritten by `bun run build` on every run
  "public/github-contributions.json",
  "public/og.png",
  "public/og-me.png",
  "public/og-x.png",
  "public/apple-touch-icon.png",
  "public/icon-192.png",
  "public/icon-512.png",
  "public/notes-media/",
  // Never part of the site
  ".claude/",
  ".github/",
  "worker/",
  "README.md",
  "DEPLOY.md",
  "DESIGN.md",
  "master-cv.tex",
  ".env.example",
  ".gitignore",
];
const CHECK = process.argv.includes("--check");
const FORCE = process.argv.includes("--force");
const IN_ACTIONS = process.env.GITHUB_ACTIONS === "true";

const log = (msg) => console.log(`[deploy-pages] ${msg}`);
function fail(msg) {
  console.error(IN_ACTIONS ? `::error::${msg}` : `[deploy-pages] ${msg}`);
  process.exit(1);
}

/** git's stdout. Throws on a non-zero exit, without printing git's own error. */
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });
function succeeds(...args) {
  try {
    git(...args);
    return true;
  } catch {
    return false;
  }
}

// ── What changed since the last commit ────────────────────────────────────────────────────

/** Every path with uncommitted changes, untracked files included. */
function changedPaths() {
  const entries = git("status", "--porcelain", "--untracked-files=all", "-z").split("\0").filter(Boolean);
  const paths = [];
  for (let i = 0; i < entries.length; i++) {
    paths.push(entries[i].slice(3));
    // A rename or copy is followed by the path it came from, which changed too.
    if (/[RC]/.test(entries[i].slice(0, 2))) paths.push(entries[++i]);
  }
  return paths;
}

/** A note the Notion sync owns: `source: notion` in the file, or in HEAD's copy if it was deleted. */
function isSyncedNote(file) {
  if (!/^content\/notes\/[^/]+\.md$/.test(file)) return false;
  try {
    const full = path.join(ROOT, file);
    const text = fs.existsSync(full) ? fs.readFileSync(full, "utf-8") : git("show", `HEAD:${file}`);
    return matter(text).data.source === "notion";
  } catch {
    return false;
  }
}

const isSource = (file) =>
  !NOT_SOURCE.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p)) && !isSyncedNote(file);

// ── Deploy ────────────────────────────────────────────────────────────────────────────────

function deploy() {
  if (!fs.existsSync(path.join(ROOT, "out", "index.html"))) fail("out/ has no build in it. Run `bun run build` first.");
  if (!fs.existsSync(WRANGLER)) fail("wrangler isn't installed. Run `bun install` first.");

  const commit = git("rev-parse", "HEAD").trim();
  const changed = changedPaths();
  const changes = changed.filter(isSource);
  const dirty = changes.length > 0;

  if (dirty) {
    // A CI checkout only ever differs from main by build outputs, so anything else is a bug.
    if (IN_ACTIONS) fail(`The build changed files it shouldn't have, so not deploying: ${changes.join(", ")}`);
    log(`Deploying ${commit.slice(0, 7)} plus uncommitted changes to:`);
    for (const file of changes) log(`  ${file}`);
    log("Cloudflare records this deploy as dirty, so the publish-notes workflow won't deploy over it.");
    log("Once these changes are committed and pushed, deploy again and it picks back up.");
  } else {
    log(`Deploying ${commit.slice(0, 7)}, with everything committed.`);
    if (changed.length) log("(The uncommitted files are build outputs or never reach the site, so wrangler's warning about them can be ignored.)");
  }

  const result = spawnSync(
    process.execPath,
    [
      WRANGLER,
      "pages",
      "deploy",
      "out",
      `--project-name=${PROJECT}`,
      "--branch=production",
      `--commit-hash=${commit}`,
      `--commit-dirty=${dirty}`,
    ],
    { cwd: ROOT, stdio: "inherit" }
  );
  process.exit(result.status ?? 1);
}

// ── Check (publish-notes workflow) ────────────────────────────────────────────────────────

/** The deployment serving production right now, or null when there isn't one. */
async function liveDeployment() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !account) fail("CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must both be set.");
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/${PROJECT}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const reason = json.errors?.[0]?.message;
    fail(`Couldn't read the live deploy from Cloudflare: HTTP ${res.status}${reason ? `, ${reason}` : ""}.`);
  }
  return json.result?.canonical_deployment ?? null;
}

/** Prints the decision and hands it to the workflow as the step output `deploy`. */
function decide(deploy, msg) {
  console.log(IN_ACTIONS ? `::notice::${msg}` : `[deploy-pages] ${msg}`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `deploy=${deploy}\n`);
}

async function check() {
  if (FORCE) return decide(true, "Forced: deploying main as it is.");

  const live = await liveDeployment();
  if (!live) return decide(true, "Nothing is deployed yet, so deploying main.");

  const { commit_hash: commit, commit_dirty: dirty } = live.deployment_trigger?.metadata ?? {};
  if (!commit) {
    fail('The live deploy doesn\'t say which commit it came from (a dashboard upload?). Run "bun run deploy" from main once, or run this workflow with force.');
  }
  const short = commit.slice(0, 7);
  if (!succeeds("merge-base", "--is-ancestor", commit, "HEAD")) {
    return decide(false, `The live site was deployed from ${short}, which isn't on main, so not deploying over it. This picks up again once it's pushed.`);
  }
  if (succeeds("diff", "--quiet", commit, "HEAD", "--", ...NOTES)) {
    return decide(false, `The live site (${short}) already has every note on main. Nothing to publish.`);
  }
  if (dirty) {
    fail(
      `main has notes to publish, but the live site was deployed from ${short} plus uncommitted changes, ` +
        `and deploying main would undo them. Commit and push those changes, then run "bun run deploy" from main ` +
        `(or run this workflow with force to publish main as it is).`
    );
  }
  return decide(true, `main has notes the live site (${short}) doesn't. Deploying.`);
}

if (CHECK) await check();
else deploy();
