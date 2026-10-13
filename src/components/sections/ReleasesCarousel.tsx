"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

type GalleryItem = { artist: string; title: string; format: string; art: string; shape: string };

const spanishItems: GalleryItem[] = [
  { artist: "Mara Sol", title: "Luz de regreso", format: "Single", art: "release-art-violet", shape: "release-shape-orbit" },
  { artist: "Norte Azul", title: "Otra velocidad", format: "EP", art: "release-art-blue", shape: "release-shape-lines" },
  { artist: "Cielo Firme", title: "Punto de partida", format: "Álbum", art: "release-art-lilac", shape: "release-shape-disc" },
  { artist: "Lía Nómada", title: "Cerca del sol", format: "Single", art: "release-art-magenta", shape: "release-shape-blocks" },
];
const englishItems: GalleryItem[] = [
  { artist: "Mara Sol", title: "Light Returns", format: "Single", art: "release-art-violet", shape: "release-shape-orbit" },
  { artist: "Norte Azul", title: "Another Speed", format: "EP", art: "release-art-blue", shape: "release-shape-lines" },
  { artist: "Cielo Firme", title: "Starting Point", format: "Album", art: "release-art-lilac", shape: "release-shape-disc" },
  { artist: "Lía Nómada", title: "Near the Sun", format: "Single", art: "release-art-magenta", shape: "release-shape-blocks" },
];

export function ReleasesCarousel() {
  const { language, t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const copy = t.publicHome.releases;
  const items = language === "es" ? spanishItems : englishItems;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanGoBack(track.scrollLeft > 4);
      setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const move = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.82, 340), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section id="artistas" className="upsi-section upsi-releases" aria-labelledby="upsi-releases-title">
      <div className="upsi-container">
        <div className="upsi-section-heading upsi-releases-heading">
          <div>
            <p className="upsi-eyebrow">{copy.eyebrow}</p>
            <h2 id="upsi-releases-title" className="upsi-heading">{copy.title}</h2>
            <p className="upsi-section-intro">{copy.description}</p>
          </div>
          <div className="upsi-carousel-controls">
            <button type="button" className="upsi-icon-button" onClick={() => move(-1)} disabled={!canGoBack} aria-label={copy.previous}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="upsi-icon-button" onClick={() => move(1)} disabled={!canGoForward} aria-label={copy.next}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="upsi-demo-notice">{copy.demoNotice}</p>
        <div ref={trackRef} className="upsi-release-track" role="region" aria-label={copy.carouselLabel} tabIndex={0}>
          {items.map((item, index) => (
            <article className="upsi-release-card" key={item.artist} aria-label={copy.demoCardLabel + " " + (index + 1)}>
              <div className={"upsi-release-art " + item.art} aria-hidden="true">
                <div className={"upsi-release-shape " + item.shape} />
                <span className="upsi-art-type">{item.format}</span>
                <span className="upsi-art-wordmark">UPSI <i>DEMO</i></span>
              </div>
              <div className="upsi-release-meta">
                <div><p className="upsi-release-artist">{item.artist}</p><h3>{item.title}</h3></div>
                <span className="upsi-demo-tag">{copy.demoTag}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="upsi-release-footer">
          <span>{copy.carouselHint}</span>
          <Link className="upsi-inline-link" href="/aplicar">{copy.artistCta}<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
