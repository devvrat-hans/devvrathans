// Brand icons (lucide no longer ships brand marks). All are decorative by default;
// the surrounding link/button must carry the accessible label.

type IconProps = { size?: number; className?: string };

export const GithubIcon = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export const LinkedinIcon = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const XIcon = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// "DH" monogram: the same artwork as public/favicon.svg, so the site logo and the tab icon match.
// The square and letters use the theme's primary / on-primary tokens, so they follow the
// light/dark toggle. `interactive` swaps both to the accent pair when a parent `.group` is hovered.
const DH_LETTERS =
  "M10.25 21.33L6.62 21.33L6.62 10.68L10.16 10.68Q12.71 10.68 14.08 12.06Q15.45 13.45 15.45 16.02L15.45 16.02Q15.45 18.57 14.10 19.95Q12.75 21.33 10.25 21.33L10.25 21.33ZM8.57 12.37L8.57 19.63L10.16 19.63Q13.44 19.63 13.44 16.02L13.44 16.02Q13.44 12.37 10.16 12.37L10.16 12.37L8.57 12.37ZM18.95 21.33L17.00 21.33L17.00 10.68L18.95 10.68L18.95 15.12L23.43 15.12L23.43 10.68L25.38 10.68L25.38 21.33L23.43 21.33L23.43 16.81L18.95 16.81L18.95 21.33Z";

export const LogoMark = ({ size = 28, className, interactive = false }: IconProps & { interactive?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className ?? ""}`}>
    <rect
      width="32"
      height="32"
      className={interactive ? "fill-primary transition-colors group-hover:fill-accent" : "fill-primary"}
    />
    <path
      d={DH_LETTERS}
      className={interactive ? "fill-on-primary transition-colors group-hover:fill-on-accent" : "fill-on-primary"}
    />
  </svg>
);
