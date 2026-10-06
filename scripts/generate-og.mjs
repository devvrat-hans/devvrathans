/**
 * Generates public/og.png (1200x630), the site's Open Graph / X card image.
 *
 * Rendered with ImageResponse (Satori + resvg) at build time so the exported static site
 * ships a real .png with a correct content type on any static host.
 *
 * Design mirrors the site: near-black canvas, hairline rails with "+" marks where dividers
 * cross them, the hero's faded 66px grid with its accent "cursor reveal", Geist type and
 * one orange accent. Atmosphere and structure lines are drawn as one SVG layer; text and
 * the monogram are laid out by Satori on top.
 *
 * Content is deliberately sparse (name, one positioning line) so it stays legible when X
 * shrinks the card to timeline size. X also overlays the link's domain on the bottom-left of
 * card images (about 28px in, 47px tall at this size), so the bottom band is left empty.
 *
 * Fonts are vendored in scripts/fonts/ so builds never depend on the network.
 * Runs under plain `node` (uses createElement, no JSX transform needed) and is wired into
 * the `build` script before `next build`.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
// `.js` extension required for Node's ESM resolver (bun resolves either form)
import { ImageResponse } from "next/og.js";

const root = process.cwd();
const W = 1200;
const H = 630;

// Site tokens (dark theme, src/app/globals.css)
const C = {
  canvas: "#0a0a0a",
  ink: "#fafafa",
  body: "#a3a3a3",
  mute: "#808080",
  hairline: "#242424",
  hairlineStrong: "#3d3d3d",
  accent: "#ff7a2f",
};

// Frame geometry. Rails sit on the content edges; the grid is 66px so its columns land on both.
const RAIL_L = 72;
const RAIL_R = W - 72;
const GRID = 66;
const TOP_RULE = 96; // under the top band
const BOTTOM_RULE = H - 96; // above an empty band that mirrors the top one and holds X's domain overlay
const PAD = 40; // text inset from the rails

// Where the frozen "cursor" sits: a grid intersection near the top right
const GLOW_X = RAIL_L + GRID * 13;
const GLOW_Y = TOP_RULE + GRID;

// Satori measures text without kerning but draws it with kerning, so every kerned word ends
// short of its measured box and leaves a visible gap before the next word or colour run.
// Renaming the GPOS table record hides kerning from the parser, so measuring and drawing agree.
const withoutKerning = (buf) => {
  const out = Buffer.from(buf);
  for (let i = 0; i < out.readUInt16BE(4); i++) {
    const at = 12 + i * 16;
    if (out.toString("latin1", at, at + 4) === "GPOS") out.write("xPOS", at, "latin1");
  }
  return out;
};
const font = async (file) => withoutKerning(await readFile(join(root, "scripts/fonts", file)));
const fonts = [
  { name: "Geist", data: await font("Geist-Regular.ttf"), weight: 400, style: "normal" },
  { name: "Geist", data: await font("Geist-Medium.ttf"), weight: 500, style: "normal" },
  { name: "Geist", data: await font("Geist-SemiBold.ttf"), weight: 600, style: "normal" },
  { name: "GeistMono", data: await font("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
];

// Reuse the favicon's letterforms so the card's monogram matches the tab icon exactly.
const favicon = await readFile(join(root, "public/favicon.svg"), "utf8");
const monogramPath = favicon.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
if (!monogramPath) throw new Error("[generate-og] Could not read the monogram path from public/favicon.svg");

// ── Background: atmosphere + structure, as one SVG ───────────────────────────────────────
const hLine = (y) => `<rect x="0" y="${y}" width="${W}" height="1" fill="${C.hairline}"/>`;
const vLine = (x, y1 = 0, y2 = H) => `<rect x="${x}" y="${y1}" width="1" height="${y2 - y1}" fill="${C.hairline}"/>`;
// 9x9 "+" centred on the 1px lines meeting at (x, y)
const plus = (x, y) =>
  `<rect x="${x - 4}" y="${y}" width="9" height="1" fill="${C.mute}"/><rect x="${x}" y="${y - 4}" width="1" height="9" fill="${C.mute}"/>`;

const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="${GRID}" height="${GRID}" patternUnits="userSpaceOnUse" x="${RAIL_L}" y="${TOP_RULE % GRID}">
      <rect width="${GRID}" height="1" fill="#ffffff"/>
      <rect width="1" height="${GRID}" fill="#ffffff"/>
    </pattern>
    <pattern id="gridAccent" width="${GRID}" height="${GRID}" patternUnits="userSpaceOnUse" x="${RAIL_L}" y="${TOP_RULE % GRID}">
      <rect width="${GRID}" height="1" fill="${C.accent}"/>
      <rect width="1" height="${GRID}" fill="${C.accent}"/>
    </pattern>

    <!-- Base grid fades out toward the edges, like .hero-grid -->
    <radialGradient id="gridFade" cx="0.56" cy="0.3" r="0.62">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#gridFade)"/></mask>

    <!-- Accent grid revealed around the "cursor", like .hero-grid-glow -->
    <radialGradient id="revealFade" gradientUnits="userSpaceOnUse" cx="${GLOW_X}" cy="${GLOW_Y}" r="300">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.7" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="revealMask"><rect width="${W}" height="${H}" fill="url(#revealFade)"/></mask>

    <!-- Warm light behind the reveal, plus the neutral overhead light from .top-light -->
    <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="${GLOW_X}" cy="${GLOW_Y}" r="520">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0.26"/>
      <stop offset="0.35" stop-color="${C.accent}" stop-opacity="0.09"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="overhead" cx="0.5" cy="-0.1" r="0.75">
      <stop offset="0" stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>

    <!-- Film grain: breaks up banding in the dark gradients -->
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.canvas}"/>
  <rect width="${W}" height="${H}" fill="url(#overhead)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" opacity="0.055" mask="url(#gridMask)"/>
  <rect width="${W}" height="${H}" fill="url(#gridAccent)" opacity="0.45" mask="url(#revealMask)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.06" style="mix-blend-mode:overlay"/>

  <!-- Structure: rails, rules, and "+" marks where rules cross rails -->
  ${vLine(RAIL_L)}${vLine(RAIL_R)}
  ${hLine(TOP_RULE)}${hLine(BOTTOM_RULE)}
  ${[TOP_RULE, BOTTOM_RULE].map((y) => plus(RAIL_L, y) + plus(RAIL_R, y)).join("")}
</svg>`;

// ── Foreground ───────────────────────────────────────────────────────────────────────────
const h = (type, style, ...children) => createElement(type, { style: { display: "flex", ...style } }, ...children);

const Monogram = (size) =>
  createElement(
    "svg",
    { width: size, height: size, viewBox: "0 0 32 32" },
    createElement("rect", { width: 32, height: 32, fill: C.ink }),
    createElement("path", { d: monogramPath, fill: C.canvas }),
  );

// One line of mixed-colour copy. Satori lays children out as flex items, so each run is its own
// span and spaces live at the run edges (kept with whiteSpace: pre).
const line = (runs) =>
  h("div", {}, ...runs.map(([text, color], i) => createElement("span", { key: i, style: { color, whiteSpace: "pre" } }, text)));

const element = h(
  "div",
  { width: "100%", height: "100%", position: "relative", background: C.canvas, fontFamily: "Geist" },

  createElement("img", {
    src: `data:image/svg+xml;base64,${Buffer.from(backgroundSvg).toString("base64")}`,
    width: W,
    height: H,
    style: { position: "absolute", left: 0, top: 0 },
  }),

  // Top band: monogram + domain, credential on the right
  h(
    "div",
    {
      position: "absolute",
      left: RAIL_L,
      top: 0,
      width: RAIL_R - RAIL_L,
      height: TOP_RULE,
      padding: `0 ${PAD}px`,
      alignItems: "center",
      justifyContent: "space-between",
    },
    h(
      "div",
      { alignItems: "center" },
      Monogram(40),
      h("div", { marginLeft: 16, fontFamily: "GeistMono", fontSize: 21, color: C.body }, "devvrathans.com"),
    ),
    h("div", { fontFamily: "GeistMono", fontSize: 19, color: C.mute, letterSpacing: 0.4 }, "B.TECH CSE · IIT GANDHINAGAR"),
  ),

  // Name and positioning line, centred between the two rules
  h(
    "div",
    {
      position: "absolute",
      left: RAIL_L,
      top: TOP_RULE,
      width: RAIL_R - RAIL_L,
      height: BOTTOM_RULE - TOP_RULE,
      padding: `0 ${PAD}px`,
      flexDirection: "column",
      justifyContent: "center",
    },
    h(
      "div",
      { fontSize: 158, fontWeight: 600, letterSpacing: -9.2, lineHeight: 0.9, color: C.ink, marginLeft: -7 },
      "Devvrat",
      // The tight tracking also squeezes the word space; give it back so the name reads at thumbnail size.
      h("span", { marginLeft: 46 }, "Hans"),
      h("span", { color: C.accent }, "."),
    ),
    h(
      "div",
      { flexDirection: "column", marginTop: 40, fontSize: 32, lineHeight: 1.4, letterSpacing: -0.4 },
      line([
        ["Software engineer building ", C.body],
        ["agentic AI", C.ink],
        [",", C.body],
      ]),
      line([
        ["AI governance & evaluation", C.ink],
        [" tooling, and ", C.body],
        ["full-stack products", C.ink],
        [".", C.body],
      ]),
    ),
  ),
);

const response = new ImageResponse(element, { width: W, height: H, fonts });
const png = Buffer.from(await response.arrayBuffer());
await mkdir(join(root, "public"), { recursive: true });
await writeFile(join(root, "public/og.png"), png);
console.log(`[generate-og] Wrote public/og.png (${(png.length / 1024).toFixed(1)} kB)`);
