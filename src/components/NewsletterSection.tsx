"use client";

import { motion } from "framer-motion";
import { BarChart3, Hammer, NotebookPen } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import { SectionHeader, fadeUp, stagger } from "./Section";

export const NEWSLETTER_POINTS = [
  { icon: Hammer, title: "What I shipped", body: "New products, features and experiments across Aback, and why they exist." },
  { icon: BarChart3, title: "The real numbers", body: "Traffic, signups and SEO results, the good months and the flat ones." },
  { icon: NotebookPen, title: "Notes worth keeping", body: "The best of my notes, tools I'm using and links worth your time." },
];

/** Newsletter block for /me. The /newsletter page uses the same form and points. */
export default function NewsletterSection() {
  return (
    <section id="newsletter" className="divider relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_9%,transparent),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader
          index="04"
          eyebrow="Newsletter"
          title="Every other week, in your inbox."
          description="What I built, what broke, and what I learned building Aback. One email every two weeks, written by me, easy to unsubscribe from."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08, 0.05)}
          className="mt-14 grid grid-cols-1 gap-px border border-hairline bg-hairline lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.45 }} className="flex flex-col justify-center bg-canvas p-6 sm:p-10">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-mute">
              <span className="text-accent">Biweekly</span>
              <span className="h-px w-6 bg-hairline-strong" aria-hidden="true" />
              Free
            </div>
            <p className="mt-4 max-w-md text-2xl font-semibold leading-snug tracking-[-0.03em] text-ink-light sm:text-[1.75rem]">
              Join the readers following Aback from the inside.
            </p>
            <div className="mt-8">
              <NewsletterForm source="me" size="lg" />
            </div>
            <p className="mt-3 text-xs text-mute">No spam. Unsubscribe with one click, any time.</p>
          </motion.div>

          <motion.ul variants={fadeUp} transition={{ duration: 0.45 }} className="divide-y divide-hairline bg-canvas">
            {NEWSLETTER_POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 px-6 py-6 sm:px-8">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-mute"
                >
                  <Icon size={15} />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-ink-light">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{body}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
