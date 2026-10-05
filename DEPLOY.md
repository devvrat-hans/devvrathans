# Deployment runbook — devvrathans.com

Everything needed to get the site live on Cloudflare, in order. Follow top to bottom the first
time; after that, [Routine updates](#routine-updates) is all you usually need.

Two separate Cloudflare pieces:

| Piece | What it is | Where it runs |
|---|---|---|
| **Pages project `devvrathans`** | The static site itself (`out/`) | Cloudflare Pages |
| **Worker `devvrathans-charts`** | Serves fresh GitHub heatmap JSON once a day | Cloudflare Workers + KV |

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
bun run deploy    # wrangler pages deploy out --project-name=devvrathans --branch=production
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

You deploy manually, so Cloudflare's build settings and environment variables are **not** used —
`bun run build` runs on your machine and reads `.env.local`.
</details>

---

## Routine updates

Content or code change:

```bash
bun run build && bun run deploy
```

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