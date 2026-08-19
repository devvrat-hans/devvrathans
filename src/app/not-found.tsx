"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* ASCII 404 */}
        <motion.pre
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
          transition={{ duration: 0.5 }}
          className="text-accent-cyan text-xs sm:text-sm font-mono leading-tight select-none"
        >
{` ██████╗  ██████╗  ██████╗ ██████╗ 
██╔════╝ ██╔═══██╗██╔═══██╗██╔══██╗
██║  ███╗██║   ██║██║   ██║██║  ██║
██║   ██║██║   ██║██║   ██║██║  ██║
╚██████╔╝╚██████╔╝╚██████╔╝██████╔╝
 ╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝`}
        </motion.pre>

        {/* Terminal-style error message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-xl border border-hairline bg-canvas-soft p-6 text-left font-mono text-sm"
        >
          <div className="text-mute">
            <span className="text-accent-prompt">devvrathans:~$</span>{" "}
            <span className="text-terminal-output">{`curl -I https://devvrathans.com/this-page`}</span>
          </div>
          <div className="mt-3 text-[#ff5f57]">
            HTTP/1.1 404 Not Found
          </div>
          <div className="text-body">
            Content-Type: text/plain
          </div>
          <div className="mt-2 text-body">
            <span className="text-mute">#</span> The page you&apos;re looking for doesn&apos;t exist.
          </div>
          <div className="text-body">
            <span className="text-mute">#</span> Maybe it was moved, deleted, or never existed.
          </div>
          <div className="mt-3 text-mute">
            <span className="text-accent-prompt">devvrathans:~$</span>{" "}
            <span className="terminal-cursor text-terminal-cursor">█</span>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="rounded-full bg-primary text-on-primary px-6 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/#projects"
            className="rounded-full border border-hairline bg-canvas px-6 py-2.5 text-sm font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all"
          >
            View projects
          </Link>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 text-xs text-mute font-mono"
        >
          hint: try typing <span className="text-accent-cyan">ls</span> in the{" "}
          <Link href="/" className="text-body hover:text-ink-light transition-colors underline underline-offset-2">
            terminal
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
