"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useMode } from "./ModeProvider";
import Terminal from "./Terminal";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function MainShell({ children }: { children: ReactNode }) {
  const { mode, toggleMode } = useMode();

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        {mode === "terminal" ? (
          <Terminal key="terminal" onClose={toggleMode} />
        ) : (
          <div key="website" id="main" tabIndex={-1} className="flex-1 flex flex-col outline-none">
            <div className="flex-1">{children}</div>
            <Footer />
            <BackToTop />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
