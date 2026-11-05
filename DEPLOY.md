# Deployment runbook — devvrathans.com

Everything needed to get the site live on Cloudflare, in order. Follow top to bottom the first
time; after that, [Routine updates](#routine-updates) is all you usually need.

Two separate Cloudflare pieces:

| Piece | What it is | Where it runs |
|---|---|---|
| **Pages project `devvrathans`** | The static site itself (`out/`) | Cloudflare Pages |
| **Worker `devvrathans-charts`** | Serves fresh GitHub heatmap JSON once a day, and takes newsletter sign-ups at `/api/newsletter` | Cloudflare Workers + KV |

The site works without the Worker — it just falls back to a snapshot frozen at build time. The
Worker is what makes the heatmap update itself daily.

## At a glance — first-time setup

- [ ] Put `GITHUB_TOKEN=ghp_...` in `.env.local` — [step 1](#1-one-time-github-token-locally)
- [ ] `bunx wrangler login` — [step 2](#2-one-time-authenticate-wrangler)
- [ ] Create the KV namespace, paste its id into `worker/wrangler.jsonc` — [step 3](#3-one-time-create-the-kv-namespace)
- [ ] `bunx wrangler secret put GITHUB_TOKEN` — [step 4](#4-one-time-store-the-token-as-a-worker-secret)
- [ ] `bun run worker:deploy` — [step 5](#5-deploy-the-worker)
- [ ] Redeploy the Worker so the `routes` block in `worker/wrangler.jsonc` goes live — [step 6](#6-one-time-point-the-site-at-the-worker)
- [ ] `bun run build && bun run deploy` — [step 7](#7-deploy-the-site)
- [ ] Newsletter: create the `NEWSLETTER` KV namespace and the export token, then redeploy the Worker. See [Newsletter sign-ups](#newsletter-sign-ups-one-time)
- [ ] Optional: Notion notes. Add `NOTION_TOKEN` and `NOTION_NOTES_DATABASE_ID` to `.env.local` (setup in [README.md](README.md#notes-from-notion))
- [ ] Optional: let those notes publish themselves from GitHub Actions. See [Notes publish themselves](#notes-publish-themselves-one-time)
- [ ] Confirm the header check in step 6 — this is what proves the heatmap is live

Every deploy after that is just `bun run build && bun run deploy`.

---

## 0. Prerequisites

- [Node **and** [bun](https://bun.sh) (`bun --version`)
- A Cloudflare account that owns the `devvrathans.com` zone
- A GitHub PAT with `read:user` scope (classic) or read access to your user data (fine-grained).
  Create one at GitHub → Settings → Developer settings → Personal access tokens.

## 1. One-time: GitHub token locally

The build embeds private contributions into a snapshot; the Worker needs the same token.

```bash
# .env.local  (gitignored — never commit this)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Confirm it works:

```bash
bun run charts:refresh
# expect: [fetch-github-charts] Saved 366 days, N total contributions.
```

Without the token the build still succeeds, it just warns and ships the cached snapshot.

## 2. One-time: authenticate Wrangler

```bash
bunx wrangler login
bunx wrangler whoami      # confirm the right account is active
```

## 3. One-time: create the KV namespace

```bash
bunx wrangler kv namespace create GITHUB_CHARTS --config worker/wrangler.jsonc
```

Copy the printed `id` and paste it into `worker/wrangler.jsonc`, replacing the placeholder:

```jsonc
"kv_namespaces": [
  { "binding": "GITHUB_CHARTS", "id": "PASTE_THE_ID_HERE" }
]
```

> Do not skip this. `REPLACE_WITH_KV_NAMESPACE_ID` is a placeholder, not a real namespace — a real
> deploy against it is rejected by Cloudflare.

## 4. One-time: store the token as a Worker secret

```bash
bunx wrangler secret put GITHUB_TOKEN --config worker/wrangler.jsonc
# paste the same ghp_... value when prompted
```

Confirm it landed (names only, values are never shown):

```bash
bunx wrangler secret list --config worker/wrangler.jsonc
```

## 5. Deploy the Worker

```bash
bun run worker:deploy
```

Note the printed URL, e.g. `https://devvrathans-charts.<your-subdomain>.workers.dev`.

Verify it fetches real data. The very first call returns `{"error":"no contribution data yet"}`
because KV is empty — that is expected. Populate it immediately instead of waiting for the
05:00 UTC cron:

```bash
curl -s "https://devvrathans-charts.<your-subdomain>.workers.dev/github-contributions.json?refresh=1" \
  | head -c 120
# expect {"total":{"lastYear":1272},"contributions":[
```

Then a plain request returns the same data:

```bash
curl -s https://devvrathans-charts.<your-subdomain>.workers.dev/github-contributions.json | head -c 120
```

## 6. One-time: point the site at the Worker

The site requests `/github-contributions.json` on its own origin, so the Worker must answer that
exact path. **This route is already in `worker/wrangler.jsonc`:**

```jsonc
"routes": [
  { "pattern": "devvrathans.com/github-contributions.json", "zone_name": "devvrathans.com" }
]
```

All that is left is to redeploy the Worker so the route goes live:

```bash
bun run worker:deploy
```

Confirm the route wins over the static file:

```bash
curl -sI https://devvrathans.com/github-contributions.json | grep -iE "HTTP|x-charts-fetched-at|cache-control"
```

Read the result like this — this check is what proves the heatmap is live:

| What you see | Meaning |
|---|---|
| `X-Charts-Fetched-At: 2026-…` | ✅ Worker is serving. The heatmap now updates daily. |
| No such header, `cache-control: public, max-age=0, must-revalidate` | ❌ Pages is serving the build snapshot. The route did not take effect. |

If you get the second row: confirm the pattern matches the path exactly (no trailing slash), that
`zone_name` is the zone Pages serves `devvrathans.com` from, and that you redeployed the Worker
*after* adding the route.

<details>
<summary>Alternative: skip the route and use the Worker URL directly</summary>

Set this in `.env.local` **before** `bun run build` (Next inlines `NEXT_PUBLIC_*` at build time):

```
NEXT_PUBLIC_GITHUB_CHARTS_URL=https://devvrathans-charts.<your-subdomain>.workers.dev
```

Works, but the route above is cleaner — same-origin, no rebuild needed to change it later.
</details>

## 7. Deploy the site

```bash
bun run build     # OG image + heatmap snapshot + static export to out/
bun run deploy    # wrangler pages deploy, tagged with the commit (scripts/deploy-pages.mjs)
```

Then confirm:

```bash
curl -sI https://devvrathans.com | head -1                 # HTTP/2 200
curl -sI https://devvrathans.com/resume/ | head -1         # resume page
curl -sI https://devvrathans.com/resume.pdf | head -1       # PDF still served
```

<details>
<summary>Cloudflare Pages project does not exist yet?</summary>

Dashboard → **Workers & Pages** → **Create** → **Pages** → name it `devvrathans` → connect a Git
repo **or** skip and use the `wrangler pages deploy` command above, which creates/updates the
project from the CLI. Then attach the custom domain `devvrathans.com` under the project's
**Custom domains** tab.

Builds run on your machine (and in GitHub Actions for notes, see below), never on Cloudflare, so
Cloudflare's build settings and environment variables are **not** used. `bun run build` reads
`.env.local`.
</details>

## Newsletter sign-ups (one-time)

The forms on the real-me pages post to `devvrathans.com/api/newsletter`. The same Worker answers it
through the `devvrathans.com/api/*` route in `worker/wrangler.jsonc`, and stores subscribers in their
own KV namespace.

```bash
bunx wrangler kv namespace create NEWSLETTER --config worker/wrangler.jsonc
# paste the printed id over REPLACE_WITH_NEWSLETTER_KV_ID in worker/wrangler.jsonc

bunx wrangler secret put NEWSLETTER_ADMIN_TOKEN --config worker/wrangler.jsonc
# any long random string, e.g. the output of: openssl rand -hex 32

bun run worker:deploy
```

> Until the placeholder id is replaced, `bun run worker:deploy` is rejected by Cloudflare, so do
> this before the next Worker deploy.

Confirm it took (use your own address, then check the export):

```bash
curl -s https://devvrathans.com/api/newsletter -H 'Content-Type: application/json' \
  -H 'Origin: https://devvrathans.com' -d '{"email":"you@example.com","source":"deploy-check"}'
# expect {"ok":true} (or {"ok":true,"already":true} the second time)

curl -s -H "Authorization: Bearer <NEWSLETTER_ADMIN_TOKEN>" https://devvrathans.com/api/newsletter/export
# expect a CSV with your address
```

## Notes publish themselves (one-time)

With this set up, ticking **Published** in Notion is all it takes. The **Publish notes** workflow
([`.github/workflows/publish-notes.yml`](.github/workflows/publish-notes.yml)) runs every 3 hours:
it syncs the notes database, commits what changed to `main` as `github-actions[bot]`, then builds
and deploys `main` if the live site doesn't have those notes yet. Until the secrets below exist it
does nothing and stays green, so it's fine to push it before finishing this.

**1. A Cloudflare API token.** Dashboard → My Profile → API Tokens → Create Token → Create Custom
Token, with one permission: **Account / Cloudflare Pages / Edit**, for the account that owns the
`devvrathans` Pages project. With more than one Cloudflare account, double-check it's that one: its
id is in the dashboard URL while the project is open (`dash.cloudflare.com/<account id>/...`).

**2. Repository secrets.** GitHub → this repo → Settings → Secrets and variables → Actions, or from
this folder (each command asks for the value):

```bash
gh secret set NOTION_TOKEN               # same value as in .env.local
gh secret set NOTION_NOTES_DATABASE_ID   # same value as in .env.local
gh secret set CLOUDFLARE_API_TOKEN       # the token from step 1
gh secret set CLOUDFLARE_ACCOUNT_ID
gh secret set CHARTS_GITHUB_TOKEN        # optional: the GITHUB_TOKEN from .env.local
```

`CHARTS_GITHUB_TOKEN` refreshes the heatmap snapshot when the workflow builds. Without it the
committed snapshot ships, which only shows if the Worker is down.

**3. Deploy once from a pushed, fully committed `main`:**

```bash
git status                         # should say there is nothing to commit
git push
bun run build && bun run deploy
```

`bun run deploy` records on Cloudflare which commit a deploy came from and whether it had
uncommitted changes. The workflow checks that before every deploy (below), and deploys made before
this setup don't record it properly, so it needs one that does.

**4. Try it:** GitHub → Actions → Publish notes → Run workflow, or `gh workflow run publish-notes.yml`.
That's also how to publish a note right away instead of waiting for the next run.

### How it avoids undoing your work

The workflow always deploys `main`. If the live site has something `main` doesn't, like a deploy
from your machine with uncommitted changes or with commits you haven't pushed, deploying `main`
would quietly take it back off the site. So it checks the live deploy first:

| The live site came from | What the workflow does |
|---|---|
| A commit on `main`, with everything committed | Deploys whenever `main` has notes the live site doesn't |
| A commit on `main` plus uncommitted changes | Fails if there are notes to publish, and says why. Commit and push, then `bun run build && bun run deploy` |
| A commit you haven't pushed yet | Skips, and carries on once you push |

Files the build rewrites by itself (heatmap snapshot, OG images, icons, synced notes) and files that
never reach the site (docs, `worker/`, `.claude/`, `.github/`) don't count as uncommitted changes.
**Run workflow** with **force** ticked skips the check and deploys `main` as it is.

### Living with it

- The workflow pushes note commits to `main`, so `git pull --rebase` before you push.
- Anything pushed to `main` goes live with the next note, so keep `main` deployable.
- Change the schedule with the `cron` line in the workflow (times are UTC). `17 * * * *` is hourly.
- GitHub pauses scheduled workflows in public repos after 60 days without activity. If notes stop
  appearing after a quiet spell, turn it back on under Actions → Publish notes.

---

## Routine updates

Content or code change:

```bash
bun run build && bun run deploy
```

A note published in Notion needs nothing once [Notes publish themselves](#notes-publish-themselves-one-time)
is set up: it goes live within about 3 hours. Until then, the same build and deploy publishes it.

Worker change: `bun run worker:deploy`. New resume/CV PDF: replace `public/resume.pdf` /
`public/cv.pdf`, then rebuild and redeploy (see the PDF note at the bottom).

## Monitoring

```bash
bun run worker:tail    # live logs, including the 05:00 UTC cron run
```

- Cron: `0 5 * * *` UTC daily. Failures log `[heatmap] cron refresh failed: ...` and never throw —
  the previous snapshot keeps serving.
- If the snapshot goes stale (>20h), the next page view refreshes it in the background, so one
  missed cron is not a problem.
- Force a refresh at any time:
  `curl -s "https://devvrathans.com/github-contributions.json?refresh=1" | head -c 120`

## Checks to run after any change

```bash
bun run typecheck   # app + worker
bun run lint        # 11 pre-existing errors are expected (see README)
bun run build
```

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Heatmap stuck on old dates | Route not set (step 6) or Worker down. `curl -sI https://devvrathans.com/github-contributions.json` — no `X-Charts-Fetched-At` header means the static file is being served instead of the Worker |
| Worker deploy fails on KV id | Step 3 not finished; `REPLACE_WITH_KV_NAMESPACE_ID` still in `worker/wrangler.jsonc` |
| Worker returns 503 | KV is empty and the GitHub fetch failed. `bun run worker:tail` to read the error, then `?refresh=1` |
| `bun run worker:dev` fails with "Failed to start the remote proxy session" | A deploy rewrote `worker/wrangler.jsonc` with `"remote": true`, so local dev now wants the production KV. Set it back to `false` |
| Deploy rewrites `worker/wrangler.jsonc` | Expected — Wrangler reformats it and rewrites the KV binding. Re-check the `id` and keep `remote: false` |
| 401/403 from GitHub | `GITHUB_TOKEN` expired or lacks `read:user`. Re-run step 4 |
| Build says "GITHUB_TOKEN not set" | `.env.local` missing or the token is quoted oddly. It must be `GITHUB_TOKEN=ghp_...` with no quotes |
| `wrangler login` picks the wrong account | Cloudflare dashboard → Member settings → API Tokens → Create Token (Account: Workers Scripts edit, KV edit) → `wrangler login` accepts it via `CLOUDFLARE_API_TOKEN` |
| `Authentication error [code: 10000]` on deploy | Wrangler is logged in to a different Cloudflare account from the one that owns this site. `bunx wrangler whoami` shows which; `bunx wrangler login` and pick the right one |
| Publish notes run: notice "NOTION_TOKEN isn't set yet" | The repository secrets aren't there yet. See [Notes publish themselves](#notes-publish-themselves-one-time), step 2 |
| Publish notes fails at "Sync notes from Notion" | The log line says which: a wrong `NOTION_TOKEN`, a database not shared with the integration, or no `Published` property. Same fixes as for `bun run notes:sync` |
| Publish notes fails at "Check the live site", "plus uncommitted changes" | The live site has work `main` doesn't. Commit and push it, then `bun run build && bun run deploy`. Or Run workflow with force to publish `main` as it is |
| Publish notes fails at "Commit note changes to main" with a rebase conflict | A synced note was edited by hand on `main`. Notion owns those files: make the edit in Notion, revert it on `main`, then run again |
| Publish notes fails at "Check the live site" with HTTP 403, or at "Deploy to Cloudflare Pages" | `CLOUDFLARE_API_TOKEN` needs Cloudflare Pages: Edit, and `CLOUDFLARE_ACCOUNT_ID` must be the account that owns the project. A failed deploy is retried by the next run |
| Terminal/heatmap empty in browser | CORS on the Worker endpoint, or an ad blocker. `curl` the endpoint directly to isolate |

## Local development

```bash
bun run dev           # site on :3000
bun run worker:dev    # Worker on :8787
```

`worker/.dev.vars` holds the local token (gitignored). Test the feed:

```bash
curl -s http://localhost:8787/github-contributions.json | head -c 120
curl -s "http://localhost:8787/cdn-cgi/local/scheduled"   # trigger the cron handler
```

Point the site at the local Worker by setting
`NEXT_PUBLIC_GITHUB_CHARTS_URL=http://localhost:8787/github-contributions.json` before `bun run dev`.

## Note on the PDFs

`public/resume.pdf` and `public/cv.pdf` are compiled artifacts. `master-cv.tex` is the CV source and
needs a local LaTeX toolchain (`pdflatex`/`xelatex`/`tectonic`) to rebuild — it is not installed in
this environment. Regenerate them, copy into `public/`, then `bun run build && bun run deploy`.