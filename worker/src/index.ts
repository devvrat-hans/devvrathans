/**
 * GitHub contribution heatmap data feed.
 *
 * Runs a daily cron trigger that pulls the contribution calendar via the GitHub
 * GraphQL API (including private contributions, so it needs a token) and stores
 * the result in KV. The site fetches this endpoint at runtime, so the heatmap
 * stays fresh without redeploying the site.
 *
 * Deploy with: bun run worker:deploy  (see worker/README.md for one-time setup)
 */

export interface Env {
  /** KV namespace holding the latest snapshot. Binding id lives in wrangler.jsonc. */
  GITHUB_CHARTS: KVNamespace;
  /** PAT with `read:user` scope. Set with `wrangler secret put GITHUB_TOKEN`. */
  GITHUB_TOKEN: string;
}

const USERNAME = "devvrat-hans";
const KV_KEY = "contributions";
/** Re-fetch from GitHub if the stored snapshot is older than this. */
const MAX_AGE_MS = 20 * 60 * 60 * 1000;

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

interface Snapshot {
  total: { lastYear: number };
  contributions: { date: string; count: number; level: number }[];
  fetchedAt: string;
}

/** Fetch the calendar from GitHub and persist it. Throws if GitHub is unreachable. */
async function refresh(env: Env): Promise<Snapshot> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "devvrathans-heatmap-worker",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  });

  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);

  const json = (await res.json()) as {
    data?: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                date: string;
                contributionCount: number;
                contributionLevel: string;
              }[];
            }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  const calendar = json.data!.user.contributionsCollection.contributionCalendar;
  const snapshot: Snapshot = {
    total: { lastYear: calendar.totalContributions },
    contributions: calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] ?? 0,
      })),
    ),
    fetchedAt: new Date().toISOString(),
  };

  await env.GITHUB_CHARTS.put(KV_KEY, JSON.stringify(snapshot));
  return snapshot;
}

async function readSnapshot(env: Env): Promise<Snapshot | null> {
  const stored = await env.GITHUB_CHARTS.get(KV_KEY, "json");
  return stored as Snapshot | null;
}

function isStale(snapshot: Snapshot): boolean {
  return Date.now() - new Date(snapshot.fetchedAt).getTime() > MAX_AGE_MS;
}

function respond(snapshot: Snapshot | null, status: number, extraHeaders: HeadersInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    // Never let an edge or browser cache a failure - only real data is cacheable.
    "Cache-Control": status >= 400 ? "no-store" : "public, max-age=300",
    ...(extraHeaders as Record<string, string>),
  };

  return new Response(
    snapshot ? JSON.stringify(snapshot) : JSON.stringify({ error: "no contribution data yet" }),
    { status, headers },
  );
}

/** Same status and headers, no body - required for HEAD requests. */
function stripBody(res: Response): Response {
  return new Response(null, { status: res.status, headers: res.headers });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      // 204 must not carry a body, so build the response directly.
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const isHead = request.method === "HEAD";
    if (!isHead && request.method !== "GET") {
      return respond(null, 405, { Allow: "GET, HEAD, OPTIONS" });
    }

    let snapshot = await readSnapshot(env);
    const force = url.searchParams.get("refresh") === "1";

    // `?refresh=1` forces a synchronous refresh (useful for a manual "update now" check).
    if (force) {
      try {
        snapshot = await refresh(env);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const stale = snapshot
          ? respond(snapshot, 200, { "X-Charts-Stale": "true", "X-Charts-Error": message })
          : respond(null, 502, { "X-Charts-Error": message });
        return isHead ? stripBody(stale) : stale;
      }
    } else if (!snapshot || isStale(snapshot)) {
      // No snapshot yet, or a stale one: refresh in the background and serve what we have,
      // so a slow or failing GitHub call never blocks the page.
      ctx.waitUntil(
        refresh(env).catch((err) => console.error(`[heatmap] refresh failed: ${err.message}`)),
      );
    }

    const body = snapshot
      ? respond(snapshot, 200, { "X-Charts-Fetched-At": snapshot.fetchedAt })
      : respond(null, 503);

    // HEAD must return the same headers with no body.
    return isHead ? stripBody(body) : body;
  },

  async scheduled(_event, env, ctx): Promise<void> {
    ctx.waitUntil(
      refresh(env).catch((err) => console.error(`[heatmap] cron refresh failed: ${err.message}`)),
    );
  },
} satisfies ExportedHandler<Env>;