"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useMode } from "./ModeProvider";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { mode, toggleMode } = useMode();
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";

  const links = [
    { label: "About", href: isHome ? "#about" : "/#about", isRoute: false },
    { label: "Experience", href: isHome ? "#experience" : "/#experience", isRoute: false },
    { label: "Projects", href: isHome ? "#projects" : "/#projects", isRoute: false },
    { label: "Skills", href: isHome ? "#skills" : "/#skills", isRoute: false },
    { label: "Resume", href: "/resume", isRoute: true },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "Contact", href: isHome ? "#contact" : "/#contact", isRoute: false },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/resume") return pathname === "/resume";
    if (href === "/blog") return pathname.startsWith("/blog");
    return false;
  };

  const handleNavClick = () => {
    setMobileOpen(false);
    if (mode === "terminal") {
      toggleMode();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-2 text-ink-light font-semibold text-sm tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="font-mono text-accent-cyan text-xs">~/</span>
          <span>devvrathans</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => {
            const active = isLinkActive(link.href);
            const className = `rounded-full px-3 py-1.5 text-[13px] transition-all ${
              active
                ? "text-ink-light font-medium bg-canvas-soft border border-hairline"
                : "text-body hover:text-ink-light hover:bg-canvas-soft/60"
            }`;

            if (link.isRoute) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className={className}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-hairline bg-canvas text-body hover:text-ink-light hover:border-hairline-strong transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Mode toggle (Website / Terminal) */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {mode === "website" ? (
                <motion.span
                  key="terminal"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Terminal size={12} className="text-accent-cyan" />
                  <span className="hidden sm:inline">Terminal</span>
                </motion.span>
              ) : (
                <motion.span
                  key="website"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Globe size={12} className="text-accent-cyan" />
                  <span className="hidden sm:inline">Website</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* GitHub icon link */}
          <a
            href="https://github.com/devvrat-hans"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full border border-hairline bg-canvas text-body hover:text-ink-light hover:border-hairline-strong transition-all"
            aria-label="GitHub Profile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-hairline text-body hover:text-ink-light transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-hairline bg-canvas/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((link) => {
                const active = isLinkActive(link.href);
                const className = `rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "text-ink-light font-medium bg-canvas-soft border border-hairline"
                    : "text-body hover:text-ink-light hover:bg-canvas-soft"
                }`;

                if (link.isRoute) {
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={handleNavClick}
                      className={className}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={handleNavClick}
                    className={className}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
