"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3, Disc3, Globe2, Headphones } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const serviceLinks = ["#plataformas", "#artistas", "/analiticas", "/soporte"];
const serviceIcons = [Globe2, Disc3, BarChart3, Headphones];

export function Services() {
  const { t } = useTranslation();
  const copy = t.publicHome.services;

  return (
    <section id="servicios" className="upsi-section" aria-labelledby="upsi-services-title">
      <div className="upsi-container">
        <div className="upsi-section-heading">
          <p className="upsi-eyebrow">{copy.eyebrow}</p>
          <h2 id="upsi-services-title" className="upsi-heading">{copy.title}</h2>
          <p className="upsi-section-intro">{copy.intro}</p>
        </div>
        <div className="upsi-service-grid">
          {copy.items.map((item, index) => {
            const Icon = serviceIcons[index]!;
            return (
              <article className="upsi-service-card" key={item.title}>
                <div className="upsi-icon-box"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className="upsi-inline-link" href={serviceLinks[index]!}>
                  {copy.learnMore}<ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
