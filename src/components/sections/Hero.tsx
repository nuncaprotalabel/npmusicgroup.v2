"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Hero() {
  const { t } = useTranslation();
  const copy = t.publicHome.hero;

  return (
    <section id="inicio" className="upsi-hero" aria-labelledby="upsi-home-title">
      <div className="upsi-hero-background" aria-hidden="true">
        <div className="upsi-hero-grid" />
        <div className="upsi-hero-glow" />
        <div className="upsi-hero-slash upsi-hero-slash-one" />
        <div className="upsi-hero-slash upsi-hero-slash-two" />
      </div>
      <div className="upsi-container upsi-hero-layout">
        <div className="upsi-hero-copy">
          <p className="upsi-eyebrow"><span className="upsi-eyebrow-mark" aria-hidden="true" />{copy.eyebrow}</p>
          <h1 id="upsi-home-title" className="upsi-hero-title">
            <span>{copy.line1}</span>
            <span className="upsi-accent-text">{copy.line2}</span>
          </h1>
          <p className="upsi-hero-description">{copy.description}</p>
          <div className="upsi-hero-actions">
            <Link href="/aplicar" className="upsi-button upsi-button-primary">
              {copy.primary}<ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#servicios" className="upsi-button upsi-button-quiet">
              {copy.secondary}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="upsi-hero-note">{copy.processNote}</p>
        </div>
        <div className="upsi-hero-art" role="img" aria-label={copy.visualAlt}>
          <div className="upsi-art-orbit" aria-hidden="true" />
          <div className="upsi-mark-frame">
            <Image
              src="/upsi-mark.webp"
              alt=""
              width={640}
              height={640}
              priority
              sizes="(max-width: 760px) 78vw, 42vw"
              className="upsi-mark-image"
            />
          </div>
          <div className="upsi-art-caption" aria-hidden="true">
            <span>UPSI</span><span>Distribución musical</span>
          </div>
          <div className="upsi-art-index" aria-hidden="true">01 / 06</div>
        </div>
      </div>
      <a className="upsi-scroll-cue" href="#plataformas" aria-label={copy.scrollLabel}>
        <span>{copy.scrollLabel}</span><ArrowDown size={15} aria-hidden="true" />
      </a>
    </section>
  );
}
