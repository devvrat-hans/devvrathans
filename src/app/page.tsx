"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Terminal from "@/components/Terminal";

export default function Home() {
  const [mode, setMode] = useState<"website" | "terminal">("website");

  const toggleMode = () => {
    setMode((prev) => (prev === "website" ? "terminal" : "website"));
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Nav mode={mode} onModeToggle={toggleMode} />

      <AnimatePresence mode="wait">
        {mode === "website" ? (
          <main key="website">
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
          </main>
        ) : (
          <Terminal key="terminal" onClose={toggleMode} />
        )}
      </AnimatePresence>
    </div>
  );
}
