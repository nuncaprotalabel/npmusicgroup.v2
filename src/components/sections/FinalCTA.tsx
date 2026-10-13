"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function FinalCTA() {
  const { t } = useTranslation();
  const copy = t.publicHome.final;

  return (
    <section className="upsi-final-section" aria-labelledby="upsi-final-title">
      <div className="upsi-container">
        <div className="upsi-final-card">
          <div className="upsi-final-shape" aria-hidden="true" />
          <div className="upsi-final-content">
            <p className="upsi-eyebrow">{copy.eyebrow}</p>
            <h2 id="upsi-final-title">{copy.title}</h2>
            <p>{copy.description}</p>
            <Link href="/aplicar" className="upsi-button upsi-button-primary">{copy.cta}<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="upsi-final-mark" aria-hidden="true">UPSI</div>
        </div>
      </div>
    </section>
  );
}
