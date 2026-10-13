"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/i18n/useTranslation";

const trackedSectionIds = ["inicio", "servicios", "planes", "artistas", "como-funciona", "recursos"];

export function Navbar() {
  const { language, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const labels = t.publicHome.nav;
  const links = [
    { label: labels.home, href: "#inicio", section: "inicio" },
    { label: labels.services, href: "#servicios", section: "servicios" },
    { label: labels.plans, href: "#planes", section: "planes" },
    { label: labels.artists, href: "#artistas", section: "artistas" },
    { label: labels.process, href: "#como-funciona", section: "como-funciona" },
    { label: labels.resources, href: "#recursos", section: "recursos" },
    { label: labels.contact, href: "/contacto", section: "" },
  ];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const sections = trackedSectionIds;
    const elements = sections.map((id) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    if (elements.length === 0 || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0.05, 0.25, 0.5] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const requestLabel = language === "es" ? "Solicitar acceso" : "Request access";
  const loginLabel = language === "es" ? "Iniciar sesión" : "Sign in";

  return (
    <>
      <a className="upsi-skip-link" href="#contenido">{language === "es" ? "Saltar al contenido" : "Skip to content"}</a>
      <header className="upsi-header">
      <div className="upsi-container upsi-header-inner">
        <Link href="/#inicio" className="upsi-brand-lockup" onClick={closeMenu}>
          <Image src="/upsi-mark.webp" alt="UPSI" width={42} height={42} priority />
          <span><strong>UPSI</strong><small>{t.publicHome.brandTagline}</small></span>
        </Link>
        <nav className="upsi-desktop-nav" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          {links.map((item) => <Link key={item.label} href={item.href} aria-current={item.section && activeSection === item.section ? "location" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="upsi-header-actions">
          <LanguageSelector />
          <Link href="/login" className="upsi-login-link">{loginLabel}</Link>
          <Link href="/aplicar" className="upsi-header-cta">{requestLabel}<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="upsi-mobile-actions">
          <LanguageSelector />
          <button type="button" className="upsi-menu-toggle" aria-label={menuOpen ? (language === "es" ? "Cerrar menú" : "Close menu") : (language === "es" ? "Abrir menú" : "Open menu")} aria-expanded={menuOpen} aria-controls="upsi-mobile-nav" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="upsi-mobile-nav" className={menuOpen ? "upsi-mobile-nav is-open" : "upsi-mobile-nav"} aria-label={language === "es" ? "Navegación principal" : "Main navigation"} aria-hidden={!menuOpen}>
        <div className="upsi-mobile-nav-links">
          {links.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu} aria-current={item.section && activeSection === item.section ? "location" : undefined}>{item.label}</Link>)}
        </div>
        <div className="upsi-mobile-nav-actions">
          <Link href="/login" onClick={closeMenu}>{loginLabel}</Link>
          <Link href="/aplicar" className="upsi-button upsi-button-primary" onClick={closeMenu}>{requestLabel}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </nav>
      </header>
    </>
  );
}
