"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/site";

/**
 * Scroll-spy for a sectioned page (the home page by default, or /me with ME_SECTIONS): returns
 * the id of the section currently crossing the middle band of the viewport, or "" when above
 * the first one.
 */
export function useActiveSection(enabled: boolean, sections: readonly { id: string }[] = SECTIONS): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!enabled) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band just above the vertical centre decides which section is "current".
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));

    // Clear the highlight when scrolled back up into the hero.
    const onScroll = () => {
      if (window.scrollY < elements[0].offsetTop - window.innerHeight * 0.45) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, sections]);

  return enabled ? active : "";
}
