"use client";

import { useTranslation } from "@/i18n/useTranslation";

const platformNames = ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "TIDAL", "Deezer"];

export function PlatformsBar() {
  const { t } = useTranslation();
  const copy = t.publicHome.platforms;

  return (
    <section id="plataformas" className="upsi-platforms" aria-labelledby="upsi-platforms-title">
      <div className="upsi-container">
        <div className="upsi-platforms-heading">
          <p id="upsi-platforms-title" className="upsi-eyebrow">{copy.eyebrow}</p>
          <p className="upsi-platforms-note">{copy.note}</p>
        </div>
        <ul className="upsi-platform-list" aria-label={copy.listLabel}>
          {platformNames.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </div>
    </section>
  );
}
