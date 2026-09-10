"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useMode } from "./ModeProvider";
import Terminal from "./Terminal";

export default function MainShell({ children }: { children: ReactNode }) {
  const { mode, toggleMode } = useMode();

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        {mode === "terminal" ? (
          <Terminal key="terminal" onClose={toggleMode} />
        ) : (
          <div key="website" className="flex-1 flex flex-col">
            {children}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
