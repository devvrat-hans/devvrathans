import { Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

/** Compact sign-up card for the end of posts, notes and list pages. */
export default function NewsletterCard({
  source,
  title = "Get the next one in your inbox.",
  body = "A short email every other week: what I shipped at Aback, the numbers, and the best of my notes.",
}: {
  source: string;
  title?: string;
  body?: string;
}) {
  return (
    <aside
      aria-label="Newsletter"
      className="relative overflow-hidden border border-hairline bg-canvas-soft p-6 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_70%)]"
      />
      <div className="relative">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-mute">
          <Mail size={12} className="text-accent" aria-hidden="true" />
          Newsletter · every other week
        </div>
        <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink-light">{title}</p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-body">{body}</p>
        <div className="mt-6 max-w-lg">
          <NewsletterForm source={source} />
        </div>
      </div>
    </aside>
  );
}
