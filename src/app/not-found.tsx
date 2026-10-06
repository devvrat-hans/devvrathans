"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Terminal } from "lucide-react";
import { useMode } from "@/components/ModeProvider";
import { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";

export default function NotFound() {
  const { setMode } = useMode();

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-canvas px-6 pb-16 pt-28">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="top-light absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Error 404</span>
          <h1 className="mt-3 text-gradient text-[5.5rem] font-semibold leading-none tracking-[-0.06em] sm:text-[8rem]">
            <span aria-hidden="true">404</span>
            <span className="sr-only">404: page not found</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 overflow-hidden border border-hairline bg-canvas-soft text-left font-mono text-[13px] card-elevated"
        >
          <div className="flex items-center gap-1.5 border-b border-hairline px-4 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 bg-hairline-strong hover:bg-danger" />
            <span className="h-2.5 w-2.5 bg-hairline-strong" />
            <span className="h-2.5 w-2.5 bg-hairline-strong" />
          </div>
          <div className="space-y-1 p-5">
            <div>
              <span className="text-accent">devvrathans:~$</span>{" "}
              <span className="text-ink-light">curl -I devvrathans.com/this-page</span>
            </div>
            <div className="pt-2 text-danger">HTTP/1.1 404 Not Found</div>
            <div className="text-body"># This page doesn&apos;t exist. It may have moved or never existed.</div>
            <div className="pt-2">
              <span className="text-accent">devvrathans:~$</span>{" "}
              <span className="terminal-cursor text-ink-light">█</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent sm:w-auto"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-hairline bg-canvas px-6 text-sm font-medium text-body transition-all hover:border-hairline-strong hover:text-ink-light sm:w-auto cursor-pointer"
          >
            <Search size={14} />
            Search the site
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={() => setMode("terminal")}
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs text-mute transition-colors hover:text-accent cursor-pointer"
        >
          <Terminal size={12} />
          or explore with <span className="text-accent">ls</span> in the terminal
        </motion.button>
      </div>
    </div>
  );
}
