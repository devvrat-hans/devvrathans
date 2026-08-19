"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Code2, Layers } from "lucide-react";

const stats = [
  { label: "CGPA", value: "8.30", sub: "/10", icon: GraduationCap, color: "text-accent-cyan" },
  { label: "Internships", value: "4", sub: "completed", icon: Award, color: "text-accent-pink" },
  { label: "Projects", value: "15+", sub: "shipped", icon: Code2, color: "text-accent-blue" },
  { label: "Technologies", value: "25+", sub: "used", icon: Layers, color: "text-accent-violet" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          {/* caption-mono eyebrow */}
          <span className="font-mono text-xs text-accent-cyan tracking-wide uppercase">
            // about
          </span>
          {/* display-lg: 32px, weight 600, tracking -1.28px */}
          <h2 className="mt-3 text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.04em] text-ink-light leading-tight">
            A bit about me.
          </h2>
          {/* body-lg: 18px, line-height 28px */}
          <p className="mt-5 max-w-2xl text-[17px] text-body leading-[1.65]">
            I&apos;m a 4th year B.Tech CSE student at IIT Gandhinagar passionate about
            software development and agentic AI - particularly AI governance, evaluation,
            and building safe, production-ready AI systems. I&apos;ve shipped products across
            AI infrastructure, cybersecurity, algorithmic trading, and full-stack web development.
          </p>
        </motion.div>

        {/* Stats grid - card-soft with Level 2 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="group relative rounded-xl border border-hairline bg-canvas-soft p-6 overflow-hidden card-elevated"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-semibold text-ink-light tracking-tight">
                    {stat.value}
                    <span className="text-sm font-normal text-mute ml-0.5">{stat.sub}</span>
                  </div>
                  <div className="mt-2 text-xs text-mute font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                <stat.icon size={18} className={`${stat.color} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education & quick facts - card-soft with Level 2 shadow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="mt-6 grid sm:grid-cols-2 gap-4"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-hairline bg-canvas-soft p-6 card-elevated"
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={16} className="text-accent-cyan" />
              <span className="font-mono text-xs text-accent-cyan uppercase tracking-wider">
                Education
              </span>
            </div>
            <h3 className="text-sm font-medium text-ink-light">
              B.Tech in Computer Science &amp; Engineering
            </h3>
            <p className="text-sm text-body mt-1.5">IIT Gandhinagar</p>
            <p className="text-xs text-mute mt-1">2023 - 2027</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-hairline bg-canvas-soft p-6 card-elevated"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-accent-pink" />
              <span className="font-mono text-xs text-accent-pink uppercase tracking-wider">
                Highlights
              </span>
            </div>
            <ul className="space-y-2.5 text-sm text-body">
              <li className="flex items-start gap-2">
                <span className="text-accent-cyan mt-0.5 text-xs">▸</span>
                Built AbackTools.com - developer tools site with ~500 daily clicks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-cyan mt-0.5 text-xs">▸</span>
                JEE Advanced AIR 1505 (top 1%)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-cyan mt-0.5 text-xs">▸</span>
                Dean&apos;s List - Semester I
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-cyan mt-0.5 text-xs">▸</span>
                Finnovate Hack 2025 Runner-Up
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-cyan mt-0.5 text-xs">▸</span>
                4 internships across 4 different domains
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
