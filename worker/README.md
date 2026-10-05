# GitHub heatmap data feed (Cloudflare Worker)

Refreshes the GitHub contribution heatmap **once a day** so the site shows current data
without you having to rebuild and redeploy it. The Worker pulls the calendar via the GitHub
GraphQL API (so private contributions are included), stores it in KV, and serves it as JSON.

If the Worker ever goes down, the site silently falls back to the snapshot baked into the build
by `scripts/fetch-github-charts.mjs`, then to the public-only fallback API — so the heatmap never
disappears.

## How it works

| Piece | Where |
|---|---|
| Cron: `0 5 * * *` (daily, 05:00 UTC) | `triggers.crons` in `wrangler.jsonc` |
| Data fetch | `refresh()` in `src/index.ts` (GraphQL → KV) |
| Serving | `GET /github-contributions.json` (KV, re-fetches in the background once the snapshot is >20h old) |
| Self-heal | A missed cron is recovered on the next request; `?refresh=1` forces a synchronous refresh |
| Site side | `src/components/GitHubActivity.tsx` — Worker feed → build snapshot → public fallback |

## One-time setup

```bash
# 1. Create the KV namespace and paste the printed id into worker/wrangler.jsonc
bunx wrangler kv namespace create GITHUB_CHARTS --config worker/wrangler.jsonc

# 2. Store the PAT (scope: read:user — fine-grained with read access to user data)
bunx wrangler secret put GITHUB_TOKEN --config worker/wrangler.jsonc

# 3. Deploy
bun run worker:deploy
```

The deploy prints the Worker URL, e.g. `https://devvrathans-charts.<subdomain>.workers.dev`.

## Pointing the site at the Worker

The component requests `/github-contributions.json` on your own origin by default. Either:

**A. Route it (recommended — no code or env changes).** Add a route to `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "devvrathans.com/github-contributions.json", "zone_name": "devvrathans.com" }
]
```

then `bun run worker:deploy`. The Worker answers that path and the static build snapshot behind it is
never used. Verify with `curl -sI https://devvrathans.com/github-contributions.json` — the
`X-Charts-Fetched-At` header appears only when the Worker is serving. Full walkthrough in
[`../DEPLOY.md`](../DEPLOY.md).

**B. Use the Worker URL directly.** Set this before `bun run build` (Next inlines `NEXT_PUBLIC_*` at build time):

```bash
# .env.local
NEXT_PUBLIC_GITHUB_CHARTS_URL=https://devvrathans-charts.<subdomain>.workers.dev
```

**C. Do nothing.** The Worker keeps running and staying warm, but the site reads the build
snapshot — the heatmap then only refreshes when you deploy. Not what you want long-term.

## Local development

```bash
cp worker/.dev.vars.example worker/.dev.vars   # then paste your token
bun run worker:dev                             # http://localhost:8787/github-contributions.json
```

Local dev uses an isolated local KV (`"remote": false` on the binding), so testing never touches
production data. `wrangler deploy` rewrites the config and may flip that back to `true` — set it
back to `false` if local dev suddenly asks for a remote connection.

Check what is actually stored:

```bash
curl -s http://localhost:8787/github-contributions.json | head -c 200
curl -s 'http://localhost:8787/github-contributions.json?refresh=1' | head -c 200  # force refetch
```

Served methods are `GET`, `HEAD` and `OPTIONS`; anything else returns 405.

## Monitoring

```bash
bun run worker:tail                  # live logs, including cron runs
```

The Worker also has observability enabled (Workers Logs). Cron failures are logged as
`[heatmap] cron refresh failed: ...` and never throw — the previous snapshot keeps serving.