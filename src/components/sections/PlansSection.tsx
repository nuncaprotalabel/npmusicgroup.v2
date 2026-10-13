"use client";

import Link from "next/link";
import { ArrowRight, BadgeInfo } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function PlansSection() {
  const { t } = useTranslation();
  const copy = t.publicHome.plans;

  return (
    <section id="planes" className="upsi-section upsi-section-tinted" aria-labelledby="upsi-plans-title">
      <div className="upsi-container upsi-plans-layout">
        <div>
          <p className="upsi-eyebrow">{copy.eyebrow}</p>
          <h2 id="upsi-plans-title" className="upsi-heading">{copy.title}</h2>
          <p className="upsi-section-intro">{copy.description}</p>
        </div>
        <div className="upsi-plan-note">
          <div className="upsi-plan-note-icon"><BadgeInfo size={20} aria-hidden="true" /></div>
          <div>
            <p className="upsi-plan-status">{copy.status}</p>
            <h3>{copy.noteTitle}</h3>
            <p>{copy.note}</p>
            <Link className="upsi-button upsi-button-primary" href="/contacto">
              {copy.cta}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
