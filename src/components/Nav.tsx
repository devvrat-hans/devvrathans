"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Menu, X, Sun, Moon, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useMode } from "./ModeProvider";
import { GithubIcon, LogoMark } from "./icons";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { useActiveSection } from "./useActiveSection";
import { SOCIALS } from "@/lib/site";

type NavLink = { label: string; href: string; section?: string; route?: string };

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { mode, toggleMode, setMode } = useMode();
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome && mode === "website");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape (links close it on click); lock page scroll while it's open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const links: NavLink[] = [
    { label: "About", href: isHome ? "#about" : "/#about", section: "about" },
    { label: "Experience", href: isHome ? "#experience" : "/#experience", section: "experience" },
    { label: "Projects", href: isHome ? "#projects" : "/#projects", section: "projects" },
    { label: "Skills", href: isHome ? "#skills" : "/#skills", section: "skills" },
    { label: "Blog", href: "/blog", route: "/blog" },
    { label: "Resume", href: "/resume", route: "/resume" },
  ];

  const isActive = (link: NavLink) => {
    if (link.route) return pathname.startsWith(link.route);
    return isHome && mode === "website" && activeSection === link.section;
  };

  const handleClick = (e: React.MouseEvent, link?: NavLink) => {
    setMobileOpen(false);
    if (mode !== "terminal") return;
    // Leaving the terminal: switch modes first, then scroll once the page has rendered.
    setMode("website");
    if (link?.section && isHome) {
      e.preventDefault();
      requestAnimationFrame(() =>
        setTimeout(() => document.getElementById(link.section!)?.scrollIntoView({ behavior: "smooth" }), 350)
      );
    }
  };

  const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

  const iconBtn =
    "flex items-center justify-center w-9 h-9 border border-hairline bg-canvas/60 text-body hover:text-ink-light hover:border-hairline-strong hover:bg-canvas-soft transition-all cursor-pointer";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || mobileOpen
            ? "border-b border-hairline bg-canvas/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleClick(e)}
            className="group flex items-center gap-2.5 text-ink-light font-semibold text-sm tracking-tight"
            aria-label="Devvrat Hans, home"
          >
            <LogoMark interactive />
            <span>Devvrat Hans</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link)}
                  aria-current={active ? (link.route ? "page" : "location") : undefined}
                  className={`relative px-3 py-2 text-[13px] font-medium transition-colors ${
                    active ? "text-ink-light" : "text-body hover:text-ink-light"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={openPalette}
              className="hidden sm:flex items-center gap-2 h-9 border border-hairline bg-canvas/60 pl-3 pr-1.5 text-xs text-mute hover:text-ink-light hover:border-hairline-strong transition-all cursor-pointer"
              aria-label="Open command menu"
            >
              <Search size={13} />
              <span>Search</span>
              <kbd className="border border-hairline bg-canvas-soft px-2 py-0.5 font-mono text-[10px] text-mute">
                ⌘K
              </kbd>
            </button>
            <button onClick={openPalette} className={`sm:hidden ${iconBtn}`} aria-label="Open command menu">
              <Search size={15} />
            </button>

            <button
              onClick={toggleTheme}
              className={iconBtn}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 h-9 border border-hairline bg-canvas/60 px-3 text-xs font-medium text-body hover:text-ink-light hover:border-hairline-strong transition-all cursor-pointer"
              aria-label={mode === "website" ? "Switch to terminal mode" : "Switch to website mode"}
              aria-pressed={mode === "terminal"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mode}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  {mode === "website" ? (
                    <Terminal size={13} className="text-accent" />
                  ) : (
                    <Globe size={13} className="text-accent" />
                  )}
                  <span className="hidden sm:inline">{mode === "website" ? "Terminal" : "Website"}</span>
                </motion.span>
              </AnimatePresence>
            </button>

            <a
              href={SOCIALS.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex ${iconBtn}`}
              aria-label="GitHub profile (opens in a new tab)"
            >
              <GithubIcon size={15} />
            </a>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className={`lg:hidden ${iconBtn}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 top-16 z-40 bg-canvas/60 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden fixed left-0 right-0 top-16 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-xl"
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
                <ul className="grid gap-1">
                  {[...links, { label: "Contact", href: isHome ? "#contact" : "/#contact", section: "contact" }].map(
                    (link, i) => {
                      const active = isActive(link);
                      return (
                        <motion.li
                          key={link.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * i }}
                        >
                          <Link
                            href={link.href}
                            onClick={(e) => handleClick(e, link)}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center justify-between px-4 py-3 text-base transition-colors ${
                              active
                                ? "bg-canvas-soft text-ink-light border border-hairline"
                                : "text-body hover:text-ink-light hover:bg-canvas-soft border border-transparent"
                            }`}
                          >
                            {link.label}
                            <span className="font-mono text-[11px] text-mute">0{i + 1}</span>
                          </Link>
                        </motion.li>
                      );
                    }
                  )}
                </ul>
                <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-4">
                  <a
                    href={SOCIALS.github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 border border-hairline py-2.5 text-sm text-body hover:text-ink-light"
                  >
                    <GithubIcon size={14} /> GitHub <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                  <a
                    href={SOCIALS.linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 border border-hairline py-2.5 text-sm text-body hover:text-ink-light"
                  >
                    LinkedIn <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
