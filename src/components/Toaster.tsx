"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const TOAST_EVENT = "site:toast";

/** Fire-and-forget toast from anywhere in the client tree. */
export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export default function Toaster() {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      setToast({ id: Date.now(), message });
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2200);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 border border-hairline bg-canvas-soft/95 px-4 py-2 text-sm text-ink-light shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur"
          >
            <Check size={14} className="text-accent" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Copy text to the clipboard with a toast; falls back to a mailto-free prompt-less textarea copy. */
export async function copyToClipboard(text: string, message = "Copied to clipboard") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  showToast(message);
}
