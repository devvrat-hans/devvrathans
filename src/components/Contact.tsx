"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="font-mono text-xs text-accent-cyan tracking-wide uppercase">
            // contact
          </span>
          <h2 className="mt-3 text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
            Let&apos;s connect.
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-[17px] text-body leading-[1.65]">
            I&apos;m always open to discussing new opportunities, interesting projects,
            or just having a conversation about technology.
          </p>
        </motion.div>

        {/* CTA buttons - button-primary + button-secondary (pill shape) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            href="mailto:devvrat.coding@gmail.com"
            className="flex items-center gap-2 rounded-[100px] bg-primary text-on-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Mail size={14} />
            devvrat.coding@gmail.com
          </motion.a>

          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            href="https://linkedin.com/in/devvrathans/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[100px] border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
          >
            <LinkedinIcon size={14} />
            LinkedIn
            <ExternalLink size={10} className="opacity-50" />
          </motion.a>

          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            href="https://x.com/DevvratHans"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[100px] border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
          >
            <XIcon size={14} />
            X / Twitter
            <ExternalLink size={10} className="opacity-50" />
          </motion.a>

          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            href="https://github.com/devvrat-hans"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[100px] border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
          >
            <GithubIcon size={14} />
            GitHub
            <ExternalLink size={10} className="opacity-50" />
          </motion.a>
        </motion.div>
      </div>

      {/* Footer - DESIGN.md footer spec: padding 4xl 24px (64px 24px), body-sm */}
      <div className="mt-12 border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-mute">
            <span className="font-mono text-accent-cyan">~/</span>
            <span>devvrathans</span>
            <span className="text-hairline">·</span>
            <span>IIT Gandhinagar</span>
          </div>
          <div className="text-xs text-mute font-mono">
            &copy; {new Date().getFullYear()} Devvrat Hans.
          </div>
        </div>
      </div>
    </section>
  );
}
