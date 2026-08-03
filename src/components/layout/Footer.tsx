"use client";

import Image from "next/image";
import { useId } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg width="14" height="15" viewBox="0 0 24 27" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

export function Footer() {
  const emailId = useId();
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.05 });

  const footerLinks = {
    [t.footer.sections.platform]: [
      { label: t.footer.links.artists, href: "#" },
      { label: t.footer.links.releases, href: "#" },
      { label: t.footer.links.distribution, href: "#" },
      { label: t.footer.links.revenue, href: "#" },
      { label: t.footer.links.analytics, href: "#" },
    ],
    [t.footer.sections.resources]: [
      { label: t.footer.links.blog, href: "#" },
      { label: t.footer.links.support, href: "#" },
      { label: t.footer.links.faq, href: "#" },
      { label: t.footer.links.status, href: "#" },
    ],
    [t.footer.sections.company]: [
      { label: t.footer.links.about, href: "#" },
      { label: t.footer.links.contact, href: "#" },
      { label: t.footer.links.terms, href: "#" },
      { label: t.footer.links.privacy, href: "#" },
    ],
  };

  return (
    <footer className="border-t border-[#141414] bg-[#030303]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className={`sm:col-span-2 reveal${inView ? " in-view" : ""}`}>
            <a href="#inicio" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-10 h-10 relative transition-transform duration-200 group-hover:scale-105">
                <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
              </div>
              <span className="font-bold text-white">NP Music Group</span>
            </a>
            <p className="text-sm text-[#666] leading-[1.7] max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#1A1A1A] text-[#555] hover:text-white hover:border-[#2A2A2A] hover:bg-[#111] transition-all duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links], i) => (
            <div
              key={section}
              className={`reveal${inView ? " in-view" : ""} reveal-delay-${i + 1}`}
            >
              <h4 className="text-[0.6875rem] font-semibold text-white tracking-[0.12em] uppercase mb-5">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#555] hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-[#141414]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                {t.footer.newsletter.title}
              </h4>
              <p className="text-sm text-[#555]">
                {t.footer.newsletter.description}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <label htmlFor={emailId} className="sr-only">
                {t.footer.newsletter.placeholder}
              </label>
              <input
                id={emailId}
                type="email"
                placeholder={t.footer.newsletter.placeholder}
                readOnly
                aria-label={t.footer.newsletter.ariaLabel}
                className="flex-1 sm:w-64 h-10 px-4 text-sm bg-[#080808] border border-[#1A1A1A] rounded-[8px] text-[#555] placeholder:text-[#333] focus:outline-none cursor-not-allowed select-none"
              />
              <button
                type="button"
                aria-label={t.footer.newsletter.ariaLabel}
                aria-disabled="true"
                className="h-10 w-10 flex items-center justify-center bg-[#F5C518] rounded-[8px] text-black cursor-not-allowed opacity-60 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#333]">{t.footer.copyright}</p>
          <p className="text-xs text-[#333]">
            {t.footer.madeWith}{" "}
            <span className="text-[#F5C518]">♥</span>{" "}
            {t.footer.forCommunity}
          </p>
        </div>
      </div>
    </footer>
  );
}
