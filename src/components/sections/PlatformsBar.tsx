"use client";

import { cn } from "@/utils/cn";
import { useTranslation } from "@/i18n/useTranslation";

interface PlatformsBarProps {
  label?: string;
  className?: string;
}

export function PlatformsBar({ label, className }: PlatformsBarProps) {
  const { t } = useTranslation();
  const displayLabel = label ?? t.platforms.trustedBy;

  return (
    <div className={cn("border-y border-[#1A1A1A] bg-[#050505] py-10", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="section-label text-center mb-8">{displayLabel}</p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
          {/* Spotify */}
          <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight">Spotify</span>
          </div>

          {/* Apple Music */}
          <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A7.215 7.215 0 00.09 5.08a62.458 62.458 0 00-.09 1.89v10.06c.014.53.044 1.06.125 1.59.255 1.64 1.052 2.96 2.404 3.937.617.44 1.308.715 2.033.874 1.024.22 2.061.218 3.102.213h9.184c.66-.013 1.318-.063 1.965-.194a5.982 5.982 0 002.089-.848c1.213-.806 2.02-1.913 2.374-3.32.183-.71.232-1.437.234-2.166l.001-10.003zm-9.498 11.88c0 .433-.357.784-.79.784-.432 0-.785-.35-.785-.784V12.14c0-.433.353-.784.786-.784.432 0 .79.351.79.784v5.864zm-3.577-.04c0 .433-.357.784-.79.784a.788.788 0 01-.786-.784V12.14c0-.433.353-.784.786-.784.432 0 .79.351.79.784v5.824zm6.537-8.498l-7.97 3.03a.787.787 0 01-1.046-.74V6.43c0-.434.352-.785.785-.785h7.97c.433 0 .786.35.786.784v4.147c0 .311-.184.593-.525.726z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight">Apple Music</span>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="22" height="16" viewBox="0 0 24 17" fill="#FF0000" aria-hidden="true">
              <path d="M23.495 2.205a3.02 3.02 0 0 0-2.122-2.122C19.505 0 12 0 12 0S4.495 0 2.627.083a3.02 3.02 0 0 0-2.122 2.122C0 4.073 0 8.5 0 8.5s0 4.427.505 6.295a3.02 3.02 0 0 0 2.122 2.122C4.495 17 12 17 12 17s7.505 0 9.373-.083a3.02 3.02 0 0 0 2.122-2.122C24 12.927 24 8.5 24 8.5s0-4.427-.505-6.295zM9.546 12.023V4.977L15.818 8.5l-6.272 3.523z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight">YouTube</span>
          </div>

          {/* TikTok */}
          <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="16" height="18" viewBox="0 0 24 27" fill="white" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight">TikTok</span>
          </div>

          {/* Amazon Music */}
          <div className="flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="20" height="14" viewBox="0 0 24 16" fill="white" aria-hidden="true">
              <path d="M13.958 7.501c-.528.196-.95.457-1.27.78-.321.323-.481.71-.481 1.16 0 .376.111.676.333.9.222.222.529.334.92.334.462 0 .877-.155 1.244-.465.366-.31.616-.75.75-1.32l.001-.021V7.224c-.5.08-.994.18-1.497.277zM20.764 12.6c-.177.044-.363.065-.558.065-.305 0-.564-.054-.778-.163a1.25 1.25 0 01-.515-.46 2.15 2.15 0 01-.28-.711 4.387 4.387 0 01-.085-.884V7.01h1.78V5.697h-1.78V3.31l-1.55.34v2.047h-1.3V7.01h1.3v3.437c0 .407.043.784.128 1.13.086.346.228.648.424.907.196.26.453.464.768.61.316.148.706.222 1.17.222.255 0 .508-.022.758-.067.25-.044.473-.107.668-.188l-.15-1.46zm-8.358.49c-.648.33-1.385.495-2.21.495-.648 0-1.235-.123-1.762-.37a3.9 3.9 0 01-1.335-1.01 4.574 4.574 0 01-.844-1.527 5.79 5.79 0 01-.295-1.857c0-.66.1-1.277.3-1.851.2-.574.487-1.077.862-1.509.374-.432.832-.77 1.373-1.014.54-.245 1.147-.367 1.818-.367.77 0 1.439.153 2.007.458.567.306 1.04.728 1.417 1.268l-1.186.993c-.26-.358-.557-.633-.892-.824a2.3 2.3 0 00-1.155-.287c-.406 0-.767.083-1.082.25-.315.166-.581.394-.797.683a3.135 3.135 0 00-.495 1.006 4.396 4.396 0 00-.168 1.22c0 .432.055.844.165 1.235.11.391.277.74.501 1.046.224.307.503.551.838.731.335.18.724.27 1.168.27.445 0 .84-.098 1.184-.294.344-.196.636-.476.874-.841l1.195.944a4.17 4.17 0 01-1.481 1.35zM5.21 5.697v6.87h1.55V5.697H5.21zM6.02 2.7a.948.948 0 00-.693.283.934.934 0 00-.288.684c0 .264.096.49.288.678.192.188.424.282.693.282.27 0 .5-.094.692-.282a.916.916 0 00.29-.678.916.916 0 00-.29-.684A.948.948 0 006.02 2.7zM2.093 5.697H.54v6.87h1.553V8.804h2.474V7.39H2.093V5.697zm21.907 7.25a.35.35 0 01-.35.35H.35A.35.35 0 010 12.947V.35A.35.35 0 01.35 0h23.3a.35.35 0 01.35.35v12.597z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight">amazon music</span>
          </div>

          {/* Tidal */}
          <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-200">
            <svg width="20" height="14" viewBox="0 0 30 20" fill="white" aria-hidden="true">
              <path d="M0 6.667L5 0l5 6.667L15 0l5 6.667L25 0l5 6.667-5 6.667-5-6.667-5 6.667-5-6.667-5 6.667zM5 13.333L10 20l5-6.667 5 6.667 5-6.667-5-6.667-5 6.667-5-6.667z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-tight tracking-widest">TIDAL</span>
          </div>

          <span className="text-sm text-[#404040] font-medium">{t.platforms.andMore}</span>
        </div>
      </div>
    </div>
  );
}
