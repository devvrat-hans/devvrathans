"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./icons";
import { CountUp, SectionHeader } from "./Section";

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
  total?: { lastYear: number };
  contributions: Contribution[];
  /** ISO timestamp of when the Worker last refreshed the data. */
  fetchedAt?: string;
}

// In order of freshness: the Worker feed (refreshed daily), the snapshot baked into
// the build by scripts/fetch-github-charts.mjs, then the public-only fallback API.
// Set NEXT_PUBLIC_GITHUB_CHARTS_URL at build time if the Worker is not served from
// the same origin (e.g. https://<worker>.workers.dev).
const CHARTS_URL = process.env.NEXT_PUBLIC_GITHUB_CHARTS_URL ?? "/github-contributions.json";

const LEVEL_COLORS = [
  "bg-canvas-soft-2 border-hairline",
  "bg-accent/25 border-accent/30",
  "bg-accent/50 border-accent/55",
  "bg-accent/75 border-accent/80",
  "bg-accent border-accent",
];

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Stable empty reference so the stats memo below is not invalidated on every render
// while the data is still loading.
const EMPTY_CONTRIBUTIONS: Contribution[] = [];

const isUsable = (data: unknown): data is ContributionData =>
  Array.isArray((data as ContributionData)?.contributions) &&
  (data as ContributionData).contributions.length > 0;

/** "Oct 5": the day the Worker last refreshed the data. Undefined when unknown. */
const formatFetchedAt = (fetchedAt?: string): string | undefined => {
  if (!fetchedAt) return undefined;
  const parsed = new Date(fetchedAt);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const fetchContributions = async (): Promise<ContributionData> => {
  // 1. Worker feed - refreshed daily by its cron trigger, includes private contributions
  try {
    const res = await fetch(CHARTS_URL);
    if (res.ok) {
      const data = await res.json();
      if (isUsable(data)) return data;
    }
  } catch (err) {
    console.warn(`Could not load ${CHARTS_URL}, trying fallback`, err);
  }

  // 2. Public contributions API, used when neither the Worker nor the build snapshot exists
  const fallback = await fetch(
    "https://github-contributions-api.jogruber.de/v4/devvrat-hans?y=last"
  );
  if (!fallback.ok) throw new Error("Failed to load GitHub activity data");
  return fallback.json();
};

const tooltipDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const describeDay = (date: string, count: number) =>
  `${count === 0 ? "No" : count} contribution${count === 1 ? "" : "s"} on ${tooltipDate.format(new Date(`${date}T00:00:00Z`))}`;

function ContributionGrid({
  contributions,
  fetchedAt,
  total,
}: {
  contributions: Contribution[];
  fetchedAt?: string;
  total: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  // On narrow screens the grid overflows; start scrolled to the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [contributions.length]);

  // One delegated handler for all ~370 cells; the tooltip lives outside the scroller so it is never clipped.
  const onPointerOver = (e: React.PointerEvent) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    const wrap = wrapRef.current;
    if (!cell || !wrap) return;
    const c = cell.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    // Keep the (centred) tooltip inside the card near the left/right edges.
    const x = Math.min(Math.max(c.left - w.left + c.width / 2, 110), w.width - 110);
    setTip({
      x,
      y: c.top - w.top,
      text: describeDay(cell.dataset.date!, Number(cell.dataset.count)),
    });
  };

  if (!contributions.length) return null;

  const weeks: Contribution[][] = [];
  let week: Contribution[] = [];

  // Dates are "YYYY-MM-DD" (parsed as UTC), so read the weekday in UTC to avoid timezone shifts.
  const firstDay = new Date(contributions[0].date).getUTCDay();
  for (let i = 0; i < firstDay; i++) {
    week.push({ date: "", count: 0, level: 0 });
  }
  for (const day of contributions) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) {
    while (week.length < 7) week.push({ date: "", count: 0, level: 0 });
    weeks.push(week);
  }

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, col) => {
    const firstReal = w.find((d) => d.date);
    if (firstReal) {
      const m = new Date(`${firstReal.date}T00:00:00Z`).getUTCMonth();
      if (m !== lastMonth) { monthLabels.push({ label: MONTH_LABELS[m], col }); lastMonth = m; }
    }
  });
  // A partial first month can sit right next to the following label; drop it so they don't overlap.
  if (monthLabels.length > 1 && monthLabels[1].col - monthLabels[0].col < 3) monthLabels.shift();
  // Likewise a label in the last two columns would overflow the grid's right edge.
  if (monthLabels.length && monthLabels[monthLabels.length - 1].col > weeks.length - 3) monthLabels.pop();

  // Weekday label column + one column per week; cells are square and stretch to fill the card.
  const columns = { gridTemplateColumns: `1.75rem repeat(${weeks.length}, minmax(0, 1fr))` };

  return (
    <div ref={wrapRef} className="relative">
      {/* Below lg the grid scrolls sideways (starting at the latest weeks); fade the left edge to hint at it */}
      <div
        ref={scrollRef}
        className="no-scrollbar overflow-x-auto pb-1 max-lg:[mask-image:linear-gradient(to_right,transparent,#000_2rem)]"
      >
        <div
          role="img"
          aria-label={`${total.toLocaleString()} GitHub contributions in the last year`}
          className="min-w-[680px]"
          onPointerOver={onPointerOver}
          onPointerLeave={() => setTip(null)}
        >
          {/* Month labels */}
          <div className="mb-2 grid gap-[3px]" style={columns} aria-hidden="true">
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.col}`}
                className="whitespace-nowrap font-mono text-[10px] text-mute"
                style={{ gridColumnStart: m.col + 2, gridRowStart: 1 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="grid gap-[3px]" style={columns} aria-hidden="true">
            {/* Weekday labels (Sun-first weeks: rows 1, 3, 5 = Mon, Wed, Fri) */}
            <div className="grid grid-rows-7 gap-[3px] font-mono text-[9px] leading-none text-mute">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <span key={i} className="flex items-center">
                  {d}
                </span>
              ))}
            </div>
            {weeks.map((w, col) => (
              <div key={col} className="grid grid-rows-7 gap-[3px]">
                {w.map((day, row) =>
                  day.date ? (
                    <span
                      key={row}
                      data-date={day.date}
                      data-count={day.count}
                      className={`aspect-square border transition-transform duration-150 hover:scale-[1.35] hover:outline hover:outline-1 hover:outline-ink-light ${LEVEL_COLORS[day.level]}`}
                    />
                  ) : (
                    <span key={row} className="aspect-square" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-mute">
        <span>{fetchedAt ? `updated ${fetchedAt}` : "last 12 months"}</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Less
          {LEVEL_COLORS.map((cls, i) => (
            <span key={i} className={`h-[11px] w-[11px] border ${cls}`} />
          ))}
          More
        </span>
      </div>

      {/* Hover tooltip (mouse only; the grid has a text summary for assistive tech) */}
      <AnimatePresence>
        {tip && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap border border-hairline-strong bg-canvas px-2.5 py-1.5 font-mono text-[11px] text-ink-light shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]"
            style={{ left: tip.x, top: tip.y - 8 }}
          >
            {tip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="no-scrollbar overflow-x-auto" aria-hidden="true">
      {/* Same geometry as the real grid (month row + weekday column) so nothing jumps on load */}
      <div
        className="grid min-w-[680px] animate-pulse gap-[3px] pt-[22px]"
        style={{ gridTemplateColumns: "1.75rem repeat(53, minmax(0, 1fr))" }}
      >
        <span />
        {Array.from({ length: 53 }).map((_, col) => (
          <div key={col} className="grid grid-rows-7 gap-[3px]">
            {Array.from({ length: 7 }).map((_, row) => (
              <span key={row} className="aspect-square border border-hairline bg-canvas-soft-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function GitHubActivity() {
  const { data, error } = useSWR("github-contributions", fetchContributions, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // The Worker refreshes once a day; an hourly revalidation keeps a long-lived tab current.
    refreshInterval: 60 * 60 * 1000,
  });

  const contributions: Contribution[] = data?.contributions ?? EMPTY_CONTRIBUTIONS;
  const isLoading = !data && !error;

  const formattedFetchedAt = formatFetchedAt(data?.fetchedAt);

  const stats = useMemo(() => {
    if (!contributions.length) return null;

    let total = 0;
    let activeDays = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < contributions.length; i++) {
      const c = contributions[i].count;
      total += c;
      if (c > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    let currentStreak = 0;
    const rev = [...contributions].reverse();
    let started = false;
    for (const d of rev) {
      if (d.count > 0) {
        started = true;
        currentStreak++;
      } else {
        if (started) break;
        if (currentStreak === 0 && d === rev[0]) continue;
        break;
      }
    }

    return {
      total: data?.total?.lastYear ?? total,
      activeDays,
      maxStreak,
      currentStreak,
    };
  }, [contributions, data?.total?.lastYear]);

  return (
    <section id="activity" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="05"
          eyebrow="Activity"
          title="GitHub activity."
          description="A year of commits across open-source projects, research tooling, and production systems."
          aside={
            <a
              href="https://github.com/devvrat-hans"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              <GithubIcon size={14} />
              devvrat-hans
              <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          }
        />

        {/* Heatmap & Stats Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 border border-hairline bg-canvas-soft p-5 sm:p-8 card-elevated"
        >
          {/* Key Metrics */}
          <dl className="-mx-5 -mt-5 mb-8 grid grid-cols-2 border-b border-hairline sm:-mx-8 sm:-mt-8 sm:grid-cols-4">
            {[
              { label: "Contributions", value: stats?.total.toLocaleString() ?? "0", accent: false },
              { label: "Active days", value: `${stats?.activeDays ?? 0}`, accent: false },
              { label: "Longest streak", value: `${stats?.maxStreak ?? 0}d`, accent: false },
              { label: "Current streak", value: `${stats?.currentStreak ?? 0}d`, accent: true },
            ].map((m, i) => (
              <div
                key={m.label}
                className={`flex flex-col-reverse border-hairline px-5 py-5 sm:px-8 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
              >
                <dt className="mt-1.5 text-[13px] text-mute">{m.label}</dt>
                <dd className={`text-3xl font-semibold tracking-[-0.03em] ${m.accent ? "text-accent" : "text-ink-light"}`}>
                  {isLoading ? (
                    <span className="inline-block h-8 w-20 animate-pulse bg-canvas-soft-2 align-middle" aria-label="Loading" />
                  ) : (
                    // Keyed so an hourly SWR refresh with new numbers remounts (CountUp writes to the DOM directly).
                    <CountUp key={m.value} value={m.value} />
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {isLoading && <SkeletonGrid />}
          {error && (
            <p className="text-sm text-mute font-mono">Could not load contribution data.</p>
          )}
          {!isLoading && !error && (
            <ContributionGrid contributions={contributions} fetchedAt={formattedFetchedAt} total={stats?.total ?? 0} />
          )}
        </motion.div>

      </div>
    </section>
  );
}
