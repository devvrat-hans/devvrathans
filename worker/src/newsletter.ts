/**
 * Newsletter sign-ups for the real-me side of the site (devvrathans.com/newsletter and the
 * forms on /me, /blog and /notes).
 *
 *   POST /api/newsletter          { email, source?, website? }  -> stores the address
 *   GET  /api/newsletter/export   Authorization: Bearer <NEWSLETTER_ADMIN_TOKEN>  -> CSV
 *
 * Each subscriber is one KV key, `sub:<email>`, with the details in the key's metadata, so the
 * export reads the whole list from list() without a get() per subscriber. `website` is a
 * honeypot: people never see the field, bots fill it in, and those posts are acknowledged but
 * never stored. Nothing here sends email; export the list into whatever tool sends the issues.
 */

export interface NewsletterEnv {
  /** KV namespace for subscribers. Binding id lives in wrangler.jsonc. */
  NEWSLETTER: KVNamespace;
  /** Bearer token for the CSV export. Set with `wrangler secret put NEWSLETTER_ADMIN_TOKEN`. */
  NEWSLETTER_ADMIN_TOKEN?: string;
}

interface Subscriber {
  email: string;
  source: string;
  subscribedAt: string;
  country?: string;
}

/** Origins whose pages may post sign-ups. Production is same-origin; localhost covers `bun run dev`. */
const ALLOWED_ORIGINS = ["https://devvrathans.com", "https://www.devvrathans.com"];
const isAllowedOrigin = (origin: string) =>
  ALLOWED_ORIGINS.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;
/** Sign-up attempts allowed per IP per minute. */
const RATE_LIMIT = 5;

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  if (!origin || !isAllowedOrigin(origin)) return {};
  return { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

/** Approximate per-IP limit. KV is eventually consistent, which is fine for keeping bots out. */
async function rateLimited(env: NewsletterEnv, ip: string): Promise<boolean> {
  const key = `rl:${ip}`;
  const count = Number((await env.NEWSLETTER.get(key)) ?? 0);
  if (count >= RATE_LIMIT) return true;
  await env.NEWSLETTER.put(key, String(count + 1), { expirationTtl: 60 });
  return false;
}

async function subscribe(request: Request, env: NewsletterEnv, cors: Record<string, string>): Promise<Response> {
  // Browsers always send Origin on POST: refuse other sites posting into the list.
  const origin = request.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin)) return json({ error: "Forbidden." }, 403);

  let body: Record<string, unknown>;
  try {
    const type = request.headers.get("Content-Type") ?? "";
    body = type.includes("application/json")
      ? ((await request.json()) as Record<string, unknown>)
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ error: "Invalid request." }, 400, cors);
  }

  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true }, 200, cors);

  const email = String(body.email ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "That doesn't look like an email address." }, 400, cors);
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (await rateLimited(env, ip)) {
    return json({ error: "Too many attempts. Try again in a minute." }, 429, { ...cors, "Retry-After": "60" });
  }

  const key = `sub:${email}`;
  if (await env.NEWSLETTER.get(key)) return json({ ok: true, already: true }, 200, cors);

  const subscriber: Subscriber = {
    email,
    source: String(body.source ?? "site").slice(0, 64),
    subscribedAt: new Date().toISOString(),
    country: typeof request.cf?.country === "string" ? request.cf.country : undefined,
  };
  await env.NEWSLETTER.put(key, JSON.stringify(subscriber), { metadata: subscriber });
  return json({ ok: true }, 201, cors);
}

/** Quotes a CSV cell and defuses spreadsheet formulas (a cell starting with = + - or @). */
function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

async function exportCsv(request: Request, env: NewsletterEnv): Promise<Response> {
  const token = env.NEWSLETTER_ADMIN_TOKEN;
  const given = new TextEncoder().encode(request.headers.get("Authorization") ?? "");
  const expected = new TextEncoder().encode(`Bearer ${token ?? ""}`);
  // Constant-time comparison, so the token can't be guessed byte by byte from response times.
  if (!token || given.byteLength !== expected.byteLength || !crypto.subtle.timingSafeEqual(given, expected)) {
    return json({ error: "Unauthorized." }, 401, { "WWW-Authenticate": "Bearer" });
  }

  const rows = ["email,source,subscribed_at,country"];
  let cursor: string | undefined;
  do {
    const page = await env.NEWSLETTER.list<Subscriber>({ prefix: "sub:", cursor });
    for (const key of page.keys) {
      const m = key.metadata;
      rows.push(
        [m?.email ?? key.name.slice(4), m?.source ?? "", m?.subscribedAt ?? "", m?.country ?? ""].map(csvCell).join(",")
      );
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return new Response(`${rows.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}

export async function handleNewsletter(request: Request, env: NewsletterEnv): Promise<Response> {
  const { pathname } = new URL(request.url);
  const cors = corsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...cors,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (pathname === "/api/newsletter/export" && request.method === "GET") return exportCsv(request, env);
  if (pathname !== "/api/newsletter" && pathname !== "/api/newsletter/") return json({ error: "Not found." }, 404, cors);
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { ...cors, Allow: "POST, OPTIONS" });

  return subscribe(request, env, cors);
}
