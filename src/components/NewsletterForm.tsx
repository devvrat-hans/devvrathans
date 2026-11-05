"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { ME_EMAIL } from "@/lib/site";

// Same origin in production: a Cloudflare Worker answers devvrathans.com/api/newsletter (see
// worker/README.md). For local testing, point this at `bun run worker:dev` in .env.local.
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_URL || "/api/newsletter";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Email sign-up for the biweekly newsletter. `source` records where people subscribed from
 * (e.g. "me", "blog:hello-world") so the export shows which pages bring readers in.
 */
export default function NewsletterForm({ source, size = "md" }: { source: string; size?: "md" | "lg" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();
  const lg = size === "lg";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    // Honeypot: hidden from people, so only bots fill it in.
    const website = new FormData(e.currentTarget).get("website");
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; already?: boolean };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setMessage(data.already ? "You're already on the list. See you in the next issue." : "You're in. The next issue lands in your inbox.");
    } catch (err) {
      setStatus("error");
      const reason = err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Couldn't reach the server.";
      setMessage(`${reason} Try again, or email ${ME_EMAIL} and I'll add you.`);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="status"
            className={`flex items-center gap-3 border border-accent/40 bg-canvas-soft px-4 text-ink-light ${lg ? "h-14 text-[15px]" : "h-12 text-sm"}`}
          >
            <Check size={16} className="shrink-0 text-accent" aria-hidden="true" />
            {message}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onSubmit={onSubmit}
            className="relative flex w-full flex-col gap-2 sm:flex-row"
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status === "error" || undefined}
              aria-describedby={message ? `${inputId}-msg` : undefined}
              className={`min-w-0 flex-1 border border-hairline-strong bg-canvas px-4 text-ink-light placeholder:text-mute transition-colors focus:border-ink-light focus-visible:outline-none ${
                lg ? "h-14 text-base" : "h-12 text-[15px]"
              }`}
            />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={`group inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-6 font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-wait disabled:opacity-70 cursor-pointer ${
                lg ? "h-14 text-[15px]" : "h-12 text-sm"
              }`}
            >
              {status === "loading" ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
              <span className="sr-only">{status === "loading" ? "Subscribing" : ""}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p id={`${inputId}-msg`} role="alert" className="mt-2 text-[13px] text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
