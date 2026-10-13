"use client";

import { FileCheck, Globe2, LayoutDashboard, Mail, Search, UserPlus } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const stepIcons = [UserPlus, Search, Mail, FileCheck, LayoutDashboard, Globe2];

export function HowItWorks() {
  const { t } = useTranslation();
  const copy = t.publicHome.process;

  return (
    <section id="como-funciona" className="upsi-section upsi-process" aria-labelledby="upsi-process-title">
      <div className="upsi-container">
        <div className="upsi-section-heading">
          <p className="upsi-eyebrow">{copy.eyebrow}</p>
          <h2 id="upsi-process-title" className="upsi-heading">{copy.title}</h2>
          <p className="upsi-section-intro">{copy.description}</p>
        </div>
        <ol className="upsi-process-grid">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index]!;
            return (
              <li className="upsi-process-step" key={step.title}>
                <span className="upsi-step-number" aria-hidden="true">0{index + 1}</span>
                <div className="upsi-icon-box"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>
        <p className="upsi-process-caveat">{copy.caveat}</p>
      </div>
    </section>
  );
}
