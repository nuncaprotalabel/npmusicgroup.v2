"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

export function Footer() {
  const { t } = useTranslation();
  const copy = t.publicHome.footer;
  const year = new Date().getFullYear();
  const groups = [
    { title: copy.platformTitle, links: [{ label: t.publicHome.nav.services, href: "/#servicios" }, { label: t.publicHome.nav.plans, href: "/#planes" }, { label: t.publicHome.nav.artists, href: "/#artistas" }, { label: t.publicHome.nav.process, href: "/#como-funciona" }] },
    { title: copy.resourcesTitle, links: [{ label: copy.faq, href: "/faq" }, { label: copy.guides, href: "/recursos" }, { label: copy.support, href: "/soporte" }, { label: copy.contact, href: "/contacto" }] },
    { title: copy.accountTitle, links: [{ label: copy.login, href: "/login" }, { label: copy.requestAccess, href: "/aplicar" }, { label: copy.terms, href: "/terminos" }, { label: copy.privacy, href: "/privacidad" }] },
  ];

  return (
    <footer className="upsi-footer">
      <div className="upsi-container">
        <div className="upsi-footer-main">
          <div className="upsi-footer-brand">
            <Link href="/" className="upsi-brand-lockup">
              <Image src="/upsi-mark.webp" alt="UPSI" width={43} height={43} />
              <span><strong>UPSI</strong><small>{t.publicHome.brandTagline}</small></span>
            </Link>
            <p>{copy.description}</p>
          </div>
          {groups.map((group) => (
            <div className="upsi-footer-group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>{group.links.map((link) => <li key={link.label}><Link href={link.href}>{link.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="upsi-footer-bottom">
          <p>© {year} UPSI. {copy.rights}</p>
          <p>{copy.note}</p>
        </div>
      </div>
    </footer>
  );
}
