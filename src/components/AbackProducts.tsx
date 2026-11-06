"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import PreviewWindow from "./PreviewWindow";
import { SectionHeader, fadeUp, stagger, trackSpotlight } from "./Section";
import { ABACK, PRODUCTS, type Product } from "@/lib/aback";
import AbackLinks from "./AbackLinks";

// "https://abacktools.com" → "abacktools.com"
const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Stretched-link classes: the whole card is clickable while other links stay on top. */
const stretched =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent";

export default function AbackProducts() {
  const live = PRODUCTS.filter((p) => p.status === "live");
  const soon = PRODUCTS.filter((p) => p.status === "soon");

  return (
    <section id="products" className="divider py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="02"
          eyebrow="Products"
          title="What I'm building."
          description={
            <>
              <AbackLinks text="Aback Group" /> makes focused products, each doing one job well on its own domain.{" "}
              <span className="text-ink-light">{live.length} are live</span>, and more are on the way.
            </>
          }
          aside={
            <a
              href={`${ABACK.group.href}/products`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 border border-hairline-strong px-4 text-sm font-medium text-ink-light transition-colors hover:border-ink-light"
            >
              All products
              <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          }
        />

        {/* A cell grid like the featured projects: 1px gaps over a hairline background */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08)}
          className="mt-14 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2"
        >
          {live.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
          {soon.map((p, i) => (
            <ComingSoon key={p.name} product={p} index={live.length + i + 1} />
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mute"
        >
          Need something custom built?
          <a
            href={ABACK.consultancy.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-body transition-colors hover:text-ink-light"
          >
            {ABACK.consultancy.name} is our consultancy arm
            <ArrowUpRight size={13} className="text-mute transition-colors group-hover:text-accent" aria-hidden="true" />
          </a>
        </motion.p>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ duration: 0.45 }}
      onPointerMove={trackSpotlight}
      className="spotlight card-hover group relative flex flex-col bg-canvas p-6 transition-colors hover:bg-canvas-soft sm:p-8"
    >
      {product.preview && <PreviewWindow preview={product.preview} />}

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-body">
              <span className="h-1.5 w-1.5 bg-status" aria-hidden="true" />
              Live
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-mute">{product.category}</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.025em] text-ink-light">
            <a href={product.href} target="_blank" rel="noopener noreferrer" className={stretched}>
              {product.name}
            </a>
          </h3>
          {product.href && <p className="mt-1 font-mono text-[11px] text-mute">{displayUrl(product.href)}</p>}
        </div>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-body">{product.tagline}</p>

      <ul className="mb-6 mt-5 space-y-2">
        {product.points.map((pt) => (
          <li key={pt} className="flex items-start gap-3 text-[13px] leading-relaxed text-mute">
            <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 bg-accent" />
            {pt}
          </li>
        ))}
      </ul>

      {product.stat && (
        <div className="mt-auto flex items-baseline gap-2 border-t border-hairline pt-5">
          <span className="text-2xl font-semibold tracking-[-0.03em] text-ink-light">{product.stat.value}</span>
          <span className="text-[13px] text-mute">{product.stat.label}</span>
        </div>
      )}
    </motion.article>
  );
}

/** Placeholder for an unannounced product: full width, and it points at the newsletter. */
function ComingSoon({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ duration: 0.45 }}
      className="group relative flex flex-col gap-6 bg-canvas p-6 sm:p-8 md:col-span-2 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-start gap-5">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-dashed border-hairline-strong text-mute transition-colors group-hover:border-accent group-hover:text-accent"
        >
          <Sparkles size={18} />
        </span>
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-mute">
            <span className="text-accent">{String(index).padStart(2, "0")}</span>
            {product.category}
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink-light">
            Something new is in the works<span className="terminal-cursor text-accent">_</span>
          </h3>
          <p className="mt-1.5 text-sm text-body">{product.tagline}</p>
        </div>
      </div>
      <Link
        href="/newsletter"
        className="group/cta inline-flex h-11 w-fit shrink-0 items-center gap-2 bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
      >
        Hear about it first
        <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
