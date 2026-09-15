/**
 * Generates public/og.png (1200x630) — the site's Open Graph / Twitter card image.
 *
 * Rendered with ImageResponse (Satori) at build time so the exported static site
 * ships a real .png with a correct content type on any static host.
 *
 * Design: Vercel-style dark card — ink #171717, Geist SemiBold headline,
 * Geist Mono meta labels, and the brand mesh-gradient glows (cyan/blue + pink/violet).
 *
 * Fonts are vendored in scripts/fonts/ so builds never depend on the network.
 *
 * Runs under plain `node` (uses createElement — no JSX transform needed),
 * and is wired into the `build` script before `next build`.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
// `.js` extension required for Node's ESM resolver (bun resolves either form)
import { ImageResponse } from "next/og.js";

const WIDTH = 1200;
const HEIGHT = 630;

const geistSemiBold = await readFile(
  join(process.cwd(), "scripts/fonts/Geist-SemiBold.ttf"),
);
const geistMono = await readFile(
  join(process.cwd(), "scripts/fonts/GeistMono-Regular.ttf"),
);

const fonts = [
  { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
  { name: "GeistMono", data: geistMono, weight: 400, style: "normal" },
];

const monoLabel = {
  fontFamily: "GeistMono",
  fontSize: 22,
  color: "#888888",
};

const element = createElement(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: 72,
      background: "#171717",
      position: "relative",
    },
  },

  // ── Brand mesh-gradient glows ────────────────────────────────────────────
  createElement("div", {
    style: {
      position: "absolute",
      top: -200,
      right: -160,
      width: 520,
      height: 520,
      display: "flex",
      borderRadius: 260,
      backgroundImage:
        "radial-gradient(circle at center, rgba(0,124,240,0.30) 0%, rgba(0,223,216,0.12) 38%, rgba(23,23,23,0) 68%)",
    },
  }),
  createElement("div", {
    style: {
      position: "absolute",
      bottom: -240,
      left: -200,
      width: 560,
      height: 560,
      display: "flex",
      borderRadius: 280,
      backgroundImage:
        "radial-gradient(circle at center, rgba(255,0,128,0.20) 0%, rgba(121,40,202,0.10) 38%, rgba(23,23,23,0) 68%)",
    },
  }),

  // ── Content ──────────────────────────────────────────────────────────────
  createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        position: "relative",
      },
    },

    // Top badge
    createElement(
      "div",
      { style: { display: "flex" } },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            border: "1px solid #333333",
            borderRadius: 100,
            padding: "10px 24px",
            fontFamily: "GeistMono",
            fontSize: 22,
            color: "#a1a1a1",
          },
        },
        createElement("div", {
          style: {
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: "#50e3c2",
            marginRight: 14,
            display: "flex",
          },
        }),
        "devvrathans.com",
      ),
    ),

    // Name + role
    createElement(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 108,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: -5,
            lineHeight: 1.05,
            fontFamily: "Geist",
          },
        },
        "Devvrat Hans",
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            marginTop: 20,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: -1.6,
            fontFamily: "Geist",
            // Solid brand cyan — Satori's background-clip:text proved
            // unreliable with custom fonts (text rendered near-invisible).
            color: "#50e3c2",
          },
        },
        "Software Engineer & Builder",
      ),
    ),

    // Bottom meta row
    createElement(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      createElement("div", {
        style: {
          display: "flex",
          height: 1,
          background: "#333333",
          marginBottom: 26,
        },
      }),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...monoLabel,
          },
        },
        createElement("div", { style: { display: "flex" } }, "B.TECH CSE · IIT GANDHINAGAR"),
        createElement("div", { style: { display: "flex" } }, "RUST · TYPESCRIPT · AI"),
      ),
    ),
  ),
);

const response = new ImageResponse(element, {
  width: WIDTH,
  height: HEIGHT,
  fonts,
});

const png = Buffer.from(await response.arrayBuffer());
await mkdir(join(process.cwd(), "public"), { recursive: true });
await writeFile(join(process.cwd(), "public/og.png"), png);
console.log(
  `[generate-og] Wrote public/og.png (${(png.length / 1024).toFixed(1)} kB)`,
);
