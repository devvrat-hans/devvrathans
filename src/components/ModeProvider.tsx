"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

  const toggleMode = () => {
    setMode((prev) => (prev === "website" ? "terminal" : "website"));
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
