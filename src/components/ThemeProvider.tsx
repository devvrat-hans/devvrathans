"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Inline script injected in <head> so the correct theme is applied before first
 * paint (no dark→light flash for light-mode visitors). Falls back to the OS
 * preference when the visitor has never toggled.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();`;

// The <html data-theme> attribute is the source of truth; React subscribes to it.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const getSnapshot = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
const getServerSnapshot = (): Theme => "dark";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode); theme still applies for the session */
    }
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Honour the OS "reduce motion" setting for every framer-motion animation */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}
