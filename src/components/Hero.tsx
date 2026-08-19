"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[65vh] min-h-[520px] flex items-center justify-center overflow-hidden pt-16">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 hero-grid" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-canvas to-transparent pointer-events-none z-10" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Status badge - caption-mono */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft/50 px-4 py-1.5 text-xs font-mono text-body backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
          </span>
          open to opportunities
        </motion.div>

        {/* Name - display-xl: 48px, weight 600, tracking -2.4px, line-height 48px */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] font-semibold tracking-[-0.05em] text-ink-light leading-[1.05]"
        >
          Devvrat Hans
        </motion.h1>

        {/* Subtitle - body-lg: 18px, weight 400, line-height 28px */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl text-body max-w-2xl mx-auto leading-[1.6]"
        >
          Software engineer focused on agentic AI, AI governance &amp; evaluation,
          and full-stack development. B.Tech CSE student at IIT Gandhinagar.
        </motion.p>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-5 flex items-center justify-center gap-1.5 text-sm text-mute"
        >
          <MapPin size={13} />
          <span>Gandhinagar, India</span>
        </motion.div>

        {/* CTA buttons - button-primary + button-secondary (pill shape, 100px radius) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="rounded-[100px] bg-primary text-on-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-[100px] border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
