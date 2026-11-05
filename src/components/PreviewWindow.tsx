export type Tone = "prompt" | "cmd" | "ok" | "mute" | "accent" | "warn" | "text";

/** A tiny illustrative window (terminal / log) rendered at the top of large cards. */
export interface Preview {
  title: string;
  lines: [Tone, string][][];
}

const TONE: Record<Tone, string> = {
  prompt: "text-accent",
  cmd: "text-ink-light",
  ok: "text-ink-light",
  mute: "text-mute",
  accent: "text-ink-light",
  warn: "text-mute",
  text: "text-body",
};

export default function PreviewWindow({ preview }: { preview: Preview }) {
  return (
    <div
      aria-hidden="true"
      className="relative mb-7 overflow-hidden border border-hairline bg-canvas-soft font-mono text-[11px] leading-[1.9] transition-colors group-hover:border-hairline-strong sm:text-xs"
    >
      <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2">
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="h-2 w-2 bg-hairline-strong" />
        <span className="ml-2 truncate text-[10px] text-mute">{preview.title}</span>
      </div>
      <div className="px-4 py-3">
        {preview.lines.map((segments, i) => (
          <div key={i} className="overflow-hidden text-ellipsis whitespace-pre">
            {segments.map(([tone, text], j) => (
              <span key={j} className={TONE[tone]}>
                {text}
              </span>
            ))}
            {i === preview.lines.length - 1 && (
              <span className="terminal-cursor ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
            )}
          </div>
        ))}
      </div>
      {/* Soft fade on the right edge so clipped lines don't end abruptly */}
      <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas-soft to-transparent" />
    </div>
  );
}
