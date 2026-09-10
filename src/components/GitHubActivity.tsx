"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
  total?: { lastYear: number };
  contributions: Contribution[];
}

const LEVEL_COLORS = [
  "bg-canvas-soft border-hairline",
  "bg-accent-cyan/20 border-accent-cyan/30",
  "bg-accent-cyan/45 border-accent-cyan/50",
  "bg-accent-cyan/70 border-accent-cyan/75",
  "bg-accent-cyan border-accent-cyan",
];

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fetchContributions = async (): Promise<ContributionData> => {
  // 1. Try local static file first (includes private contributions fetched via build script)
  try {
    const res = await fetch("/github-contributions.json");
    if (res.ok) {
      const data = await res.json();
      if (data?.contributions && data.contributions.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not load /github-contributions.json, trying fallback", err);
  }

  // 2. Fallback to public contributions API if local file is missing
  const fallback = await fetch(
    "https://github-contributions-api.jogruber.de/v4/devvrat-hans?y=last"
  );
  if (!fallback.ok) throw new Error("Failed to load GitHub activity data");
  return fallback.json();
};

function ContributionGrid({ contributions }: { contributions: Contribution[] }) {
  if (!contributions.length) return null;

  const weeks: Contribution[][] = [];
  let week: Contribution[] = [];

  const firstDay = new Date(contributions[0].date).getDay();
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
      const m = new Date(firstReal.date).getMonth();
      if (m !== lastMonth) { monthLabels.push({ label: MONTH_LABELS[m], col }); lastMonth = m; }
    }
  });

  return (
    <div className="overflow-x-auto pb-1">
      <div className="inline-block min-w-max">
        {/* Month labels */}
        <div className="flex mb-1.5" style={{ gap: "3px" }}>
          {weeks.map((_, col) => {
            const entry = monthLabels.find((m) => m.col === col);
            return (
              <div key={col} className="text-[9px] font-mono text-mute" style={{ width: "11px", minWidth: "11px" }}>
                {entry ? entry.label : ""}
              </div>
            );
          })}
        </div>
        {/* Grid */}
        <div className="flex" style={{ gap: "3px" }}>
          {weeks.map((w, col) => (
            <div key={col} className="flex flex-col" style={{ gap: "3px" }}>
              {w.map((day, row) => (
                <div
                  key={row}
                  title={day.date ? `${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}` : ""}
                  className={`w-[11px] h-[11px] rounded-[2px] border ${
                    day.date ? LEVEL_COLORS[day.level] : "bg-transparent border-transparent"
                  } transition-transform hover:scale-125 cursor-default`}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] font-mono text-mute">Less</span>
          {LEVEL_COLORS.map((cls, i) => (
            <div key={i} className={`w-[11px] h-[11px] rounded-[2px] border ${cls}`} />
          ))}
          <span className="text-[10px] font-mono text-mute">More</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="overflow-x-auto animate-pulse">
      <div className="flex gap-[3px]">
        {Array.from({ length: 53 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, row) => (
              <div key={row} className="w-[11px] h-[11px] rounded-[2px] bg-canvas-soft border border-hairline" />
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
  });

  const contributions: Contribution[] = data?.contributions ?? [];
  const isLoading = !data && !error;

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
    <section id="activity" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-accent-cyan tracking-wide uppercase">
            // activity
          </span>
          <div className="mt-3 flex items-baseline gap-4 flex-wrap">
            <h2 className="text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
              GitHub activity.
            </h2>
            {stats && stats.total > 0 && (
              <span className="font-mono text-sm text-mute">
                {stats.total.toLocaleString()} contributions in the last year
              </span>
            )}
          </div>
          <p className="mt-4 max-w-xl text-[17px] text-body leading-[1.65]">
            A year of commits across open-source projects, research tooling, and production systems.
          </p>
        </motion.div>

        {/* Heatmap & Stats Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 rounded-xl border border-hairline bg-canvas-soft p-5 sm:p-7 card-elevated"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg border border-hairline bg-canvas p-3.5">
              <div className="text-[11px] font-mono text-mute uppercase tracking-wider">Total Commits</div>
              <div className="text-xl sm:text-2xl font-semibold font-mono text-ink-light mt-1">
                {isLoading ? "..." : (stats?.total.toLocaleString() ?? "0")}
              </div>
            </div>
            <div className="rounded-lg border border-hairline bg-canvas p-3.5">
              <div className="text-[11px] font-mono text-mute uppercase tracking-wider">Active Days</div>
              <div className="text-xl sm:text-2xl font-semibold font-mono text-accent-cyan mt-1">
                {isLoading ? "..." : `${stats?.activeDays ?? 0}`}
              </div>
            </div>
            <div className="rounded-lg border border-hairline bg-canvas p-3.5">
              <div className="text-[11px] font-mono text-mute uppercase tracking-wider">Longest Streak</div>
              <div className="text-xl sm:text-2xl font-semibold font-mono text-ink-light mt-1">
                {isLoading ? "..." : `${stats?.maxStreak ?? 0} days`}
              </div>
            </div>
            <div className="rounded-lg border border-hairline bg-canvas p-3.5">
              <div className="text-[11px] font-mono text-mute uppercase tracking-wider">Current Streak</div>
              <div className="text-xl sm:text-2xl font-semibold font-mono text-accent-cyan mt-1">
                {isLoading ? "..." : `${stats?.currentStreak ?? 0} days`}
              </div>
            </div>
          </div>

          {isLoading && <SkeletonGrid />}
          {error && (
            <p className="text-sm text-mute font-mono">Could not load contribution data.</p>
          )}
          {!isLoading && !error && (
            <ContributionGrid contributions={contributions} />
          )}
        </motion.div>

        {/* GitHub link */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 flex justify-end"
        >
          <a
            href="https://github.com/devvrat-hans"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-mute hover:text-accent-cyan transition-colors"
          >
            github.com/devvrat-hans &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}
