"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp, Headphones } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const resourceIcons = [CircleHelp, BookOpen, Headphones];
const resourceHrefs = ["/faq", "/recursos", "/soporte"];

export function ResourcesSection() {
  const { t } = useTranslation();
  const copy = t.publicHome.resources;

  return (
    <section id="recursos" className="upsi-section upsi-resources" aria-labelledby="upsi-resources-title">
      <div className="upsi-container">
        <div className="upsi-section-heading">
          <p className="upsi-eyebrow">{copy.eyebrow}</p>
          <h2 id="upsi-resources-title" className="upsi-heading">{copy.title}</h2>
          <p className="upsi-section-intro">{copy.description}</p>
        </div>
        <div className="upsi-resource-grid">
          {copy.links.map((item, index) => {
            const Icon = resourceIcons[index]!;
            return (
              <Link className="upsi-resource-card" href={resourceHrefs[index]!} key={item.title}>
                <div className="upsi-icon-box"><Icon size={19} aria-hidden="true" /></div>
                <span><strong>{item.title}</strong><small>{item.description}</small></span>
                <ArrowRight size={16} className="upsi-resource-arrow" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
        <div className="upsi-faq-wrap">
          <h3>{copy.faqTitle}</h3>
          <div className="upsi-faq-list">
            {copy.faqs.map((item) => (
              <details className="upsi-faq-item" key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="upsi-faq-pending">{copy.pendingNote}</p>
        </div>
      </div>
    </section>
  );
}
