"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

type Mode = "website" | "terminal";

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "website",
  toggleMode: () => {},
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("website");

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "website" ? "terminal" : "website"));
  }, []);

  // Start every mode switch at the top of the page (skip the initial mount so
  // deep links like /#projects still land where they should).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
