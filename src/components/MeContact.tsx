"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Megaphone, Mail } from "lucide-react";
import Link from "next/link";
import { CopyEmailButton } from "./Contact";
import { XIcon } from "./icons";
import { SectionHeader, fadeUp, stagger } from "./Section";
import { ME_EMAIL, SOCIALS } from "@/lib/site";

const rowClass = "group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-canvas-soft sm:px-8";

const rows = [
  { label: "Message me on X", note: `${SOCIALS.x.handle} · building in public`, href: SOCIALS.x.href, Icon: XIcon, external: true },
  { label: "Sponsor a post on X", note: "Rates for posts, quotes and pins", href: "/x", Icon: Megaphone, external: false },
  { label: "Hiring?", note: "The portfolio and resume live here", href: "/", Icon: Briefcase, external: false },
];

/** Contact block for /me: the Aback address instead of the portfolio one. */
export default function MeContact() {
  return (
    <section id="say-hi" className="divider relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader
          index="05"
          eyebrow="Say hi"
          title="Building something too?"
          description="I like talking to other builders: launches, SEO, growth, tools, or just what you're working on. Email me or send a DM."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08, 0.05)}
          className="mt-14 grid grid-cols-1 gap-px border border-hairline bg-hairline lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.45 }} className="flex flex-col bg-canvas p-6 sm:p-10">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-mute">
              <Mail size={13} aria-hidden="true" />
              Email
            </div>
            <a
              href={`mailto:${ME_EMAIL}`}
              className="group mt-5 inline-flex w-fit max-w-full items-center gap-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-ink-light sm:text-4xl"
            >
              <span className="truncate bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
                {ME_EMAIL}
              </span>
              <ArrowUpRight
                size={26}
                className="hidden shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                aria-hidden="true"
              />
            </a>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={`mailto:${ME_EMAIL}`}
                className="group inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
              >
                Say hello
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <CopyEmailButton email={ME_EMAIL} />
            </div>

            <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-10 text-[13px] text-mute">
              <span className="h-1.5 w-1.5 bg-status" aria-hidden="true" />
              Usually replies within a day or two
            </p>
          </motion.div>

          <motion.ul variants={fadeUp} transition={{ duration: 0.45 }} className="divide-y divide-hairline bg-canvas">
            {rows.map(({ label, note, href, Icon, external }) => {
              const body = (
                <>
                  <Icon size={16} className="shrink-0 text-mute transition-colors group-hover:text-ink-light" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-ink-light">{label}</span>
                    <span className="block truncate text-[13px] text-mute">{note}</span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </>
              );
              return (
                <li key={label}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                      {body}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={href} className={rowClass}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
