"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, XIcon } from "./icons";
import { copyToClipboard } from "./Toaster";
import { SectionHeader, fadeUp, stagger } from "./Section";
import { useLocalTime } from "./useLocalTime";
import { EMAIL, SOCIALS } from "@/lib/site";

/** Copy button that confirms inline (icon + label swap) in addition to the global toast. */
function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    await copyToClipboard(EMAIL, "Email copied");
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={onCopy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      className={`inline-flex h-12 min-w-[7rem] items-center justify-center gap-2 border px-5 text-sm font-medium transition-colors cursor-pointer ${
        copied ? "border-accent text-accent" : "border-hairline-strong text-ink-light hover:border-ink-light"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
          className="flex items-center gap-2"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
const channels = [
  { ...SOCIALS.linkedin, Icon: LinkedinIcon, note: "Professional updates" },
  { ...SOCIALS.github, Icon: GithubIcon, note: "Code & open source" },
  { ...SOCIALS.x, Icon: XIcon, note: "Thoughts & builds" },
];

function LocalTimeNote() {
  const time = useLocalTime();
  if (!time) return null;
  return <span className="text-body">· {time.label} local time</span>;
}

const rowClass =
  "group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-canvas-soft sm:px-8";

export default function Contact() {
  return (
    <section id="contact" className="divider relative overflow-hidden py-24 sm:py-32">
      {/* A faint warm light rising from the bottom edge to close the page */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader
          index="06"
          eyebrow="Contact"
          title="Let's build something."
          description="Open to new opportunities, interesting projects, or just a good conversation about technology. I usually reply within a day or two."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08, 0.05)}
          className="mt-14 grid grid-cols-1 gap-px border border-hairline bg-hairline lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
        >
          {/* Primary: email */}
          <motion.div variants={fadeUp} transition={{ duration: 0.45 }} className="flex flex-col bg-canvas p-6 sm:p-10">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-mute">
              <Mail size={13} aria-hidden="true" />
              Email
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="group mt-5 inline-flex w-fit max-w-full items-center gap-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-ink-light sm:text-4xl"
            >
              <span className="truncate bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
                {EMAIL}
              </span>
              <ArrowUpRight
                size={26}
                className="hidden shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                aria-hidden="true"
              />
            </a>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
              >
                Say hello
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <CopyEmailButton />
            </div>

            <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-10 text-[13px] text-mute">
              <span className="h-1.5 w-1.5 bg-status" aria-hidden="true" />
              Gandhinagar, India · IST (UTC+5:30)
              <LocalTimeNote />
            </p>
          </motion.div>

          {/* Secondary channels */}
          <motion.ul variants={fadeUp} transition={{ duration: 0.45 }} className="divide-y divide-hairline bg-canvas">
            {channels.map(({ label, href, note, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                  <Icon size={16} className="shrink-0 text-mute transition-colors group-hover:text-ink-light" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-ink-light">{label}</span>
                    <span className="block truncate text-[13px] text-mute">{note}</span>
                  </span>
                  <ArrowUpRight size={15} className="shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <Link href="/resume" className={rowClass}>
                <FileText size={16} className="shrink-0 text-mute transition-colors group-hover:text-ink-light" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-ink-light">Resume &amp; CV</span>
                  <span className="block truncate text-[13px] text-mute">View or download PDF</span>
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
              </Link>
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
