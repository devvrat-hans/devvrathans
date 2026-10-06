/**
 * Generates the PNG app icons from the favicon's "DH" monogram:
 *   public/apple-touch-icon.png  180x180  iOS home screen (iOS rounds the corners itself)
 *   public/icon-192.png          192x192  web app manifest
 *   public/icon-512.png          512x512  web app manifest (also listed as maskable)
 *
 * Icons are opaque and full-bleed (iOS and Android both expect that). The letters sit inside
 * the central 80% safe zone, so the 512px icon survives Android's circular / squircle masks.
 *
 * Runs under plain `node` and is wired into the `build` script before `next build`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
// `.js` extension required for Node's ESM resolver (bun resolves either form)
import { ImageResponse } from "next/og.js";

const root = process.cwd();

// Same letterforms as the favicon, so every icon matches the tab icon.
const favicon = await readFile(join(root, "public/favicon.svg"), "utf8");
const monogramPath = favicon.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
if (!monogramPath) throw new Error("[generate-icons] Could not read the monogram path from public/favicon.svg");

// Dark tile with light letters: the site's default (dark) theme, and it reads on any wallpaper.
const icon = (size) =>
  createElement(
    "div",
    { style: { display: "flex", width: "100%", height: "100%", background: "#0a0a0a" } },
    createElement(
      "svg",
      { width: size, height: size, viewBox: "0 0 32 32" },
      createElement("path", { d: monogramPath, fill: "#fafafa" }),
    ),
  );

const targets = [
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];

for (const [file, size] of targets) {
  const response = new ImageResponse(icon(size), { width: size, height: size });
  const png = Buffer.from(await response.arrayBuffer());
  await writeFile(join(root, "public", file), png);
  console.log(`[generate-icons] Wrote public/${file} (${(png.length / 1024).toFixed(1)} kB)`);
}
