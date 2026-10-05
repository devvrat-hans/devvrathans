# devvrathans.com

Personal site for Devvrat Hans — portfolio, resume/CV, project catalogue, blog, and a GitHub
contribution heatmap. Static Next.js export deployed to Cloudflare Pages, plus a small Cloudflare
Worker that keeps the heatmap data fresh.

## Stack

Next.js 16 (App Router, `output: "export"`) · React 19 · TypeScript · Tailwind CSS v4 ·
framer-motion · SWR · markdown-it + gray-matter for the blog.

## Commands

| Command | What it does |
|---|---|
| `bun run dev` | Local dev server |
| `bun run build` | Regenerates OG image + heatmap snapshot, then static export to `out/` |
| `bun run typecheck` | Typechecks the app and the Worker |
| `bun run lint` | ESLint (has pre-existing style errors; see below) |
| `bun run deploy` | Publishes `out/` to Cloudflare Pages |
| `bun run charts:refresh` | Refreshes `public/github-contributions.json` only |
| `bun run worker:dev` / `worker:deploy` / `worker:tail` | Cloudflare Worker for the heatmap feed |

## Deployment

Full step-by-step runbook (first-time Cloudflare setup, Worker, verification, troubleshooting):
**[DEPLOY.md](DEPLOY.md)**.

```bash
bun run build && bun run deploy
```

The build script needs `GITHUB_TOKEN` (scope `read:user`) in `.env.local` so the heatmap snapshot
includes private contributions. Without it the build still succeeds and ships the last cached
snapshot.

## GitHub heatmap

The heatmap reads `/github-contributions.json`. In production that path is served by a Cloudflare
Worker that refreshes the data on a daily cron, so the heatmap updates without redeploying. Setup
and routing steps are in [`worker/README.md`](worker/README.md). Without the Worker the site falls
back to the build snapshot, then to a public-only API.

## Content

- Blog posts: `content/blog/*.md` (frontmatter: title, date, tags, excerpt)
- Portfolio copy: `src/components/*.tsx`
- Resume/CV PDFs: `public/resume.pdf`, `public/cv.pdf` (served from `/resume`)

## Known lint state

`bun run lint` currently reports 11 errors, all pre-existing and unrelated to any single feature:
`react/jsx-no-comment-textnodes` on explanatory JSX comments and `react-hooks/set-state-in-effect`
in `ThemeProvider`/blog pages.