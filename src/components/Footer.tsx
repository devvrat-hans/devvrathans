"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, LogoMark, XIcon } from "./icons";
import { EMAIL, SECTIONS, SOCIALS } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname() || "/";
  const prefix = pathname === "/" ? "" : "/";

  const socials = [
    { ...SOCIALS.github, Icon: GithubIcon },
    { ...SOCIALS.linkedin, Icon: LinkedinIcon },
    { ...SOCIALS.x, Icon: XIcon },
  ];

  return (
    <footer className="divider bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink-light">
              <LogoMark />
              Devvrat Hans
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-body">
              Software engineer building agentic AI, governance tooling, and full-stack products.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="flex h-9 w-9 items-center justify-center border border-hairline text-body transition-colors hover:border-hairline-strong hover:text-ink-light"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Sections">
            {SECTIONS.slice(0, 4).map((s) => (
              <FooterLink key={s.id} href={`${prefix}#${s.id}`}>
                {s.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="More">
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/resume">Resume &amp; CV</FooterLink>
            <FooterLink href={`${prefix}#activity`}>GitHub activity</FooterLink>
            <FooterLink href={`${prefix}#contact`}>Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Get in touch">
            <a href={`mailto:${EMAIL}`} className="break-all text-sm text-body transition-colors hover:text-ink-light">
              {EMAIL}
            </a>
            <span className="text-sm text-mute">Gandhinagar, India</span>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-mute">&copy; {new Date().getFullYear()} Devvrat Hans</p>
          <div className="flex items-center gap-5 font-mono text-xs text-mute">
            <p className="hidden sm:block">
              press <kbd className="border border-hairline px-1.5 py-0.5 text-[10px]">⌘K</kbd> to jump anywhere
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink-light cursor-pointer"
            >
              <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
              back to top
            </button>
          </div>
        </div>
      </div>

      <Wordmark />
    </footer>
  );
}

const WORDMARK = "devvrathans";

/**
 * Oversized wordmark that bleeds off the bottom edge, split into one span per letter.
 * Hovering lifts the whole word slightly out of the edge and brightens it. Letters near the
 * pointer rise further and pick up the accent, falling off with distance like a wave: each
 * letter gets a proximity value --p (0..1) that the CSS turns into lift and accent opacity.
 * Touch has no hover, so a tap lights the word where it was touched and then lets it settle.
 */
function Wordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const frame = useRef(0);
  const litTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      clearTimeout(litTimer.current);
    },
    []
  );

  // Pass null to drop every letter back to rest. Batched to one update per frame.
  const light = (clientX: number | null) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const chars = charsRef.current.filter((el): el is HTMLSpanElement => el !== null);
      if (chars.length === 0) return;
      // Read every position before writing any style so the browser lays out only once.
      const centres = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      // Influence spans roughly one letter either side of the pointer, at any font size.
      const reach = parseFloat(getComputedStyle(chars[0]).fontSize) * 1.1;
      chars.forEach((el, i) => {
        const t = clientX === null ? 0 : Math.max(0, 1 - Math.abs(clientX - centres[i]) / reach);
        el.style.setProperty("--p", (t * t * (3 - 2 * t)).toFixed(3)); // smoothstep
      });
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => light(e.clientX);
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    // Touch pointers "leave" right after lifting; their reset is handled by the timer below.
    if (e.pointerType === "mouse") light(null);
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || !wrapRef.current) return;
    clearTimeout(litTimer.current);
    wrapRef.current.dataset.lit = "";
    light(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    clearTimeout(litTimer.current);
    litTimer.current = setTimeout(() => {
      if (wrapRef.current) delete wrapRef.current.dataset.lit;
      light(null);
    }, 1200);
  };

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      onPointerEnter={onPointerMove}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="wordmark select-none overflow-hidden pt-8"
    >
      <p className="mx-auto -mb-[0.24em] w-full max-w-6xl whitespace-nowrap px-4 text-center text-[clamp(3.25rem,14vw,11.5rem)] font-semibold leading-none tracking-[-0.065em]">
        {[...WORDMARK].map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              charsRef.current[i] = el;
            }}
            data-char={ch}
            className="wordmark-char"
          >
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-mute">{title}</h2>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex w-fit items-center gap-1 text-sm text-body transition-colors hover:text-ink-light"
    >
      {children}
      {external && <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100" />}
    </Link>
  );
}
