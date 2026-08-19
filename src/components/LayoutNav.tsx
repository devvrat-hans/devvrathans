"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function LayoutNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, toggleTheme } = useTheme();

  if (isHome) {
    // Home page renders its own Nav with mode toggle
    return null;
  }

  // Non-home pages: simplified nav matching DESIGN.md nav-bar spec
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-ink-light font-semibold text-sm tracking-tight">
          <span className="font-mono text-accent-cyan text-xs">~/</span>
          <span>devvrathans</span>
        </a>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-0.5">
            <a href="/" className="rounded-full px-3 py-1.5 text-[13px] text-body hover:text-ink-light transition-colors">
              Home
            </a>
            <a href="/blog" className="rounded-full px-3 py-1.5 text-[13px] text-body hover:text-ink-light transition-colors">
              Blog
            </a>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-hairline bg-canvas text-body hover:text-ink-light hover:border-hairline-strong transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
