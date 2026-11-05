"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Megaphone } from "lucide-react";
import { XIcon } from "@/components/icons";
import { fadeUp, stagger, trackSpotlight } from "@/components/Section";
import { ADD_ONS, COMBOS, CORE, RATES, X_PROFILE, comboPrice, usd, type RateId } from "@/lib/x-rates";
import { ME_EMAIL } from "@/lib/site";

/** mailto: with the package already filled in, so a booking is one click and a few blanks. */
const bookHref = (pkg: string, price: number) => {
  const subject = `X promotion: ${pkg}`;
  const body = [
    "Hi Devvrat,",
    "",
    `I'd like to book: ${pkg} (${usd(price)}).`,
    "",
    "What I'm promoting:",
    "Link:",
    "Preferred date:",
    "",
  ].join("\n");
  return `mailto:${ME_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const steps = [
  { title: "Send the details", body: "What you're promoting, the package you want, and a date that works." },
  { title: "I check the fit", body: "I only post things my readers would find useful. If it isn't a fit, I'll tell you straight away." },
  { title: "It goes live", body: "I confirm the timing, it goes out, and you get the link to the post." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
      <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
      {children}
      <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
    </h2>
  );
}

function RateTable({ ids, label }: { ids: RateId[]; label: string }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={stagger(0.06)}
      aria-label={label}
      className="mt-6 divide-y divide-hairline border border-hairline bg-canvas"
    >
      {ids.map((id) => {
        const r = RATES[id];
        return (
          <motion.li key={id} variants={fadeUp} transition={{ duration: 0.35 }}>
            <a
              href={bookHref(r.per ? `${r.name} (${r.per})` : r.name, r.price)}
              className="group relative flex items-center gap-4 px-5 py-5 transition-colors hover:bg-canvas-soft sm:px-6"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-ink-light">{r.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-mute">{r.detail}</span>
              </span>
              <span className="hidden items-center gap-1 font-mono text-[11px] text-mute opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-flex">
                Book
                <ArrowUpRight size={12} aria-hidden="true" />
              </span>
              <span className="shrink-0 text-right font-mono text-lg font-medium tabular-nums text-ink-light">
                {usd(r.price)}
                {r.per && <span className="text-sm text-mute">/{r.per}</span>}
              </span>
              <span className="sr-only">, book by email</span>
            </a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export default function XRatesClient() {
  return (
    <div className="relative overflow-hidden bg-canvas">
      <div className="grain pointer-events-none absolute inset-x-0 top-0 h-[36rem]" aria-hidden="true">
        <div className="top-light absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
      </div>

      <main className="relative px-6 pb-24 pt-28 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.header initial="hidden" animate="visible" variants={stagger(0.08)} className="text-center">
            <motion.a
              variants={fadeUp}
              href={X_PROFILE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-accent/40 bg-canvas/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent backdrop-blur transition-colors hover:border-accent"
            >
              <XIcon size={11} />
              {X_PROFILE.handle}
              {X_PROFILE.followers && (
                <>
                  <span className="text-accent/50" aria-hidden="true">
                    ·
                  </span>
                  {X_PROFILE.followers} followers
                </>
              )}
            </motion.a>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 text-[2.75rem] font-semibold leading-none tracking-[-0.05em] text-ink-light sm:text-6xl"
            >
              Promotion on X<span className="text-accent">.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-body text-pretty"
            >
              I post about building Aback in public: growth and SEO numbers, AI workflows, and dev tools. Open to
              posts, quotes, reposts and comments for products my readers would actually use.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-1.5" aria-label="What I post about">
              {X_PROFILE.topics.map((t) => (
                <li key={t} className="border border-hairline bg-canvas/60 px-2.5 py-1 font-mono text-[11px] text-body backdrop-blur">
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.header>

          {/* Core rates */}
          <section className="mt-20" aria-labelledby="core-rates">
            <div id="core-rates">
              <Eyebrow>Core rates</Eyebrow>
            </div>
            <RateTable ids={CORE} label="Core rates" />
          </section>

          {/* Add-ons */}
          <section className="mt-16" aria-labelledby="add-ons">
            <div id="add-ons">
              <Eyebrow>Add-ons</Eyebrow>
            </div>
            <RateTable ids={ADD_ONS} label="Add-ons" />
          </section>

          {/* Combos */}
          <section className="mt-16" aria-labelledby="combos">
            <div id="combos">
              <Eyebrow>Combos</Eyebrow>
            </div>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger(0.07)}
              className="mt-6 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2"
            >
              {COMBOS.map((combo) => {
                const { full, price } = comboPrice(combo);
                return (
                  <motion.li key={combo.name} variants={fadeUp} transition={{ duration: 0.35 }} className="bg-canvas">
                    <a
                      href={bookHref(combo.name, price)}
                      onPointerMove={trackSpotlight}
                      className="spotlight card-hover group flex h-full flex-col p-5 transition-colors hover:bg-canvas-soft sm:p-6"
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="text-[15px] font-medium text-ink-light">{combo.name}</span>
                        <span className="shrink-0 font-mono tabular-nums">
                          <s className="mr-2 text-sm text-mute">{usd(full)}</s>
                          <span className="text-lg font-medium text-accent">{usd(price)}</span>
                        </span>
                      </span>
                      <span className="mt-1.5 text-[13px] leading-snug text-mute">
                        {combo.items.map((id) => (RATES[id].short ?? RATES[id].name) + (RATES[id].per ? ` (${RATES[id].per})` : "")).join(" + ")}
                      </span>
                      <span className="mt-auto flex items-center justify-between pt-5">
                        <span className="border border-status/40 px-1.5 py-px font-mono text-[10px] uppercase tracking-wider text-status">
                          Save {usd(combo.save)}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-mute transition-colors group-hover:text-ink-light">
                          Book
                          <ArrowUpRight size={12} aria-hidden="true" />
                        </span>
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </section>

          {/* How it works */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger(0.08)}
            className="mt-16"
            aria-labelledby="how-it-works"
          >
            <div id="how-it-works">
              <Eyebrow>How it works</Eyebrow>
            </div>
            <ol className="mt-6 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
              {steps.map((s, i) => (
                <motion.li key={s.title} variants={fadeUp} transition={{ duration: 0.35 }} className="bg-canvas p-5 sm:p-6">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  <h3 className="mt-3 text-[15px] font-medium text-ink-light">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-body">{s.body}</p>
                </motion.li>
              ))}
            </ol>
          </motion.section>

          {/* Contact */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-16 text-center"
          >
            <p className="mx-auto max-w-md text-sm leading-relaxed text-body">
              Rates are flat, so there&apos;s no back and forth. Send what you&apos;re promoting and which package fits,
              and I&apos;ll confirm the timing.
            </p>
            <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-px border border-hairline bg-hairline text-left sm:grid-cols-2">
              <a
                href={X_PROFILE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-canvas px-5 py-4 transition-colors hover:bg-canvas-soft"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-mute transition-colors group-hover:text-ink-light">
                  <XIcon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-mute">DM</span>
                  <span className="block truncate text-sm text-ink-light">{X_PROFILE.handle}</span>
                </span>
                <ArrowUpRight size={14} className="shrink-0 text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={`mailto:${ME_EMAIL}?subject=${encodeURIComponent("Sponsored post on X")}`}
                className="group flex items-center gap-4 bg-canvas px-5 py-4 transition-colors hover:bg-canvas-soft"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-mute transition-colors group-hover:text-ink-light">
                  <Mail size={14} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-mute">Email</span>
                  <span className="block truncate text-sm text-ink-light">{ME_EMAIL}</span>
                </span>
                <ArrowUpRight size={14} className="shrink-0 text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
              </a>
            </div>
          </motion.section>

          {/* Bigger reach */}
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-16 flex flex-col gap-4 border border-dashed border-hairline-strong p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="flex items-start gap-4">
              <Megaphone size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-[15px] font-medium text-ink-light">Want reach beyond X?</p>
                <p className="mt-1 text-[13px] leading-relaxed text-body">
                  Sponsor a week on Aback Launch: one advertiser per week, shown on the launch list.
                </p>
              </div>
            </div>
            <a
              href="https://abacklaunch.com/advertise"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              See open weeks
              <ArrowUpRight size={13} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
