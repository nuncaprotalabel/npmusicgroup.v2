"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { cn } from "@/utils/cn";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: t.nav.home, href: "#inicio" },
    {
      label: t.nav.platform,
      href: "#plataforma",
      children: [
        { label: t.nav.dashboard, href: "#dashboard", description: t.nav.platformDesc },
        { label: t.nav.analytics, href: "#analiticas", description: t.nav.analyticsDesc },
        { label: t.nav.artists, href: "#artistas", description: t.nav.artistsDesc },
      ],
    },
    { label: t.nav.distribution, href: "#distribucion" },
    { label: t.nav.services, href: "#servicios" },
    {
      label: t.nav.resources,
      href: "#recursos",
      children: [
        { label: t.nav.blog, href: "#blog", description: t.nav.blogDesc },
        { label: t.nav.support, href: "#soporte", description: t.nav.supportDesc },
        { label: t.nav.faq, href: "#faq", description: t.nav.faqDesc },
      ],
    },
    { label: t.nav.pricing, href: "#precios" },
    { label: t.nav.contact, href: "#contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-350",
          scrolled
            ? "bg-black/92 backdrop-blur-2xl border-b border-[#1A1A1A] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a
              href="#inicio"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-9 h-9 relative transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="NP Music Group"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-sm font-bold text-white tracking-tight hidden sm:block transition-opacity duration-150 group-hover:opacity-90">
                NP Music Group
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150",
                      "text-[#888] hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200 text-[#555]",
                          openDropdown === item.label && "rotate-180 text-[#888]"
                        )}
                      />
                    )}
                  </a>

                  {/* Dropdown */}
                  {item.children && openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="animate-scale-in bg-[#0C0C0C] border border-[#222] rounded-xl p-1.5 min-w-[228px] shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-[#161616] transition-colors duration-150 group"
                          >
                            <span className="text-sm font-medium text-white leading-tight">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-xs text-[#666] mt-0.5 group-hover:text-[#888] transition-colors">
                                {child.description}
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSelector />
              <Button variant="ghost" size="sm" disabled>
                {t.common.login}
              </Button>
              <Button variant="primary" size="sm" disabled className="gap-1.5">
                {t.common.startNow}
                <ArrowRight size={13} />
              </Button>
            </div>

            {/* Mobile: language + menu */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSelector />
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[#737373] hover:text-white hover:bg-white/8 transition-all duration-150 active:scale-95"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in-overlay"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-xs bg-[#080808] border-l border-[#1E1E1E] flex flex-col animate-slide-in-right shadow-[-20px_0_60px_rgba(0,0,0,0.6)]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#161616]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 relative">
                  <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
                </div>
                <span className="text-sm font-bold text-white">NP Music Group</span>
              </div>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#555] hover:text-white hover:bg-white/8 transition-all duration-150 active:scale-90"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {navItems.map((item, i) => (
                <div
                  key={item.label}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 text-sm font-medium text-[#999] hover:text-white hover:bg-[#111] rounded-lg transition-all duration-150"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="ml-3 space-y-0.5">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm text-[#666] hover:text-white hover:bg-[#111] rounded-lg transition-all duration-150"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer CTA */}
            <div className="p-4 border-t border-[#161616] flex flex-col gap-2">
              <Button variant="outline" size="md" fullWidth disabled>
                {t.common.login}
              </Button>
              <Button variant="primary" size="md" fullWidth disabled>
                {t.common.startNow}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
