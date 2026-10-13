"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music2 } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function DashboardPreviewSection() {
  const { t } = useTranslation();
  const copy = t.publicHome.workspace;

  return (
    <section id="espacio-privado" className="upsi-section upsi-workspace" aria-labelledby="upsi-workspace-title">
      <div className="upsi-container upsi-workspace-layout">
        <div className="upsi-workspace-copy">
          <p className="upsi-eyebrow">{copy.eyebrow}</p>
          <h2 id="upsi-workspace-title" className="upsi-heading">{copy.title}</h2>
          <p className="upsi-section-intro">{copy.description}</p>
          <p className="upsi-workspace-note">{copy.accessNote}</p>
          <Link href="/login" className="upsi-button upsi-button-quiet">{copy.login}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="upsi-workspace-window" role="img" aria-label={copy.visualAlt}>
          <div className="upsi-window-topbar" aria-hidden="true">
            <div className="upsi-window-dots"><i /><i /><i /></div>
            <div className="upsi-window-brand"><Image src="/upsi-mark.webp" alt="" width={25} height={25} /> <span>UPSI STUDIO</span></div>
            <span className="upsi-window-state">{copy.privateLabel}</span>
          </div>
          <div className="upsi-window-content">
            <aside className="upsi-window-sidebar" aria-hidden="true">
              <span className="upsi-window-sidebar-heading">{copy.menuHeading}</span>
              {copy.menu.map((item, index) => <span className={index === 0 ? "upsi-window-menu-item is-current" : "upsi-window-menu-item"} key={item}>{item}</span>)}
            </aside>
            <div className="upsi-window-main" aria-hidden="true">
              <p className="upsi-window-kicker">{copy.dashboardLabel}</p>
              <h3>{copy.emptyTitle}</h3>
              <div className="upsi-empty-catalog">
                <div className="upsi-empty-icon"><Music2 size={24} aria-hidden="true" /></div>
                <p>{copy.emptyDescription}</p>
              </div>
              <div className="upsi-empty-lines"><i /><i /><i /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
