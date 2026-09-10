// scripts/fetch-github-charts.mjs
// Runs before `next build` — fetches GitHub contribution data (including private)
// via GraphQL API using GITHUB_TOKEN env var, writes to /public/github-contributions.json
//
// Required env var: GITHUB_TOKEN (classic PAT with read:user scope, or fine-grained with read access)
// Set locally in .env.local, and in Cloudflare Pages → Settings → Environment Variables

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "github-contributions.json");
const USERNAME = "devvrat-hans";
let TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  for (const envFile of [".env.local", ".env"]) {
    const envPath = path.join(__dirname, "..", envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^GITHUB_TOKEN=(.*)$/m);
      if (match) {
        TOKEN = match[1].trim().replace(/^["']|["']$/g, "");
        break;
      }
    }
  }
}

if (!TOKEN) {
  console.warn(
    "[fetch-github-charts] GITHUB_TOKEN not set — skipping fetch, using cached data if available."
  );
  process.exit(0);
}

// Map GitHub's contributionLevel enum to 0-4
const LEVEL_MAP = {
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

try {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "devvrathans-build-script",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  });

  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  const calendar =
    json.data.user.contributionsCollection.contributionCalendar;

  // Flatten weeks → days, matching the shape the component expects
  const contributions = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_MAP[day.contributionLevel] ?? 0,
    }))
  );

  const output = {
    total: { lastYear: calendar.totalContributions },
    contributions,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output), "utf-8");
  console.log(
    `[fetch-github-charts] Saved ${contributions.length} days, ${calendar.totalContributions} total contributions.`
  );
} catch (err) {
  console.warn(`[fetch-github-charts] Failed: ${err.message}`);
  // Don't fail the build — the component falls back to the cached file or shows empty state
  process.exit(0);
}
