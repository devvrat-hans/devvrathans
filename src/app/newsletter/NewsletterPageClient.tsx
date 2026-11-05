"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarDays, Inbox, ShieldCheck } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { NEWSLETTER_POINTS } from "@/components/NewsletterSection";
import { fadeUp, stagger } from "@/components/Section";
import { formatDate } from "@/lib/format";

const facts = [
  { icon: CalendarDays, label: "Every other week" },
  { icon: Inbox, label: "One short email" },
  { icon: ShieldCheck, label: "No spam, ever" },
];

export default function NewsletterPageClient({ posts }: { posts: { slug: string; title: string; date: string }[] }) {
  return (
    <div className="relative overflow-hidden bg-canvas">
      <div className="grain pointer-events-none absolute inset-x-0 top-0 h-[38rem]" aria-hidden="true">
        <div className="top-light absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
      </div>

      <main className="relative px-6 pb-24 pt-28 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <motion.header initial="hidden" animate="visible" variants={stagger(0.08)} className="text-center">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-accent"
            >
              Newsletter
              <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
              <span className="text-mute">biweekly</span>
            </motion.span>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-5 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.05em] text-ink-light text-balance sm:text-6xl"
            >
              Building Aback, from the inside<span className="text-accent">.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-body text-pretty sm:text-lg"
            >
              Every other week I send one email about what I&apos;m building: what shipped, the real numbers behind
              AbackTools and Aback Launch, and the notes worth keeping. Written by me, read in five minutes.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mx-auto mt-10 max-w-xl text-left">
              <NewsletterForm source="newsletter-page" size="lg" />
            </motion.div>

            <motion.ul
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-mute"
            >
              {facts.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={13} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.header>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0.08)}
            aria-labelledby="inside"
            className="mt-24"
          >
            <h2 id="inside" className="text-xs font-medium uppercase tracking-[0.16em] text-mute">
              What&apos;s inside
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
              {NEWSLETTER_POINTS.map(({ icon: Icon, title, body }, i) => (
                <motion.div key={title} variants={fadeUp} transition={{ duration: 0.4 }} className="bg-canvas p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-hairline text-mute" aria-hidden="true">
                      <Icon size={15} />
                    </span>
                    <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-medium text-ink-light">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{body}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {posts.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              aria-labelledby="recent"
              className="mt-16"
            >
              <div className="flex items-baseline justify-between border-b border-hairline-strong pb-3">
                <h2 id="recent" className="text-xs font-medium uppercase tracking-[0.16em] text-mute">
                  A taste of the writing
                </h2>
                <Link href="/blog" className="group inline-flex items-center gap-1 text-sm text-body transition-colors hover:text-ink-light">
                  All posts
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
              <ul className="divide-y divide-hairline">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                      <span className="text-[15px] text-ink-light transition-colors group-hover:text-accent">{p.title}</span>
                      <time dateTime={p.date} className="shrink-0 font-mono text-xs text-mute">
                        {formatDate(p.date)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>
      </main>
    </div>
  );
}
