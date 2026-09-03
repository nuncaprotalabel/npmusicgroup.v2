"use client";

import { useRef, useState } from "react";
import {
  Globe,
  CalendarDays,
  Wallet,
  PieChart,
  ShieldCheck,
  PlayCircle,
  Zap,
  Camera,
  Music2,
  Headphones,
  Music,
  Package,
  Radio,
  Waves,
  Disc3,
  LifeBuoy,
  BarChart3,
  Users,
  FileText,
  UserPlus,
  LayoutDashboard,
  BookOpen,
  Lock,
  BadgeCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────── Data ─────────────────────────────── */

type Status = "active" | "soon";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  status: Status;
  iconColor: string;
  iconBg: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Distribución Digital",
    description: "Área de trabajo para preparar tu presencia digital",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: CalendarDays,
    title: "Lanzamientos Programados",
    description: "Organización de próximos lanzamientos y entregas",
    status: "active",
    iconColor: "#60A5FA",
    iconBg: "rgba(96,165,250,0.10)",
  },
  {
    icon: Wallet,
    title: "Pagos de Regalías",
    description: "Área prevista para consultar información de ingresos",
    status: "active",
    iconColor: "#34D399",
    iconBg: "rgba(52,211,153,0.10)",
  },
  {
    icon: PieChart,
    title: "División de Regalías",
    description: "Herramienta prevista para organizar colaboraciones",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: ShieldCheck,
    title: "Protección de contenido",
    description: "Protección de contenido como capacidad en desarrollo",
    status: "active",
    iconColor: "#A78BFA",
    iconBg: "rgba(167,139,250,0.10)",
  },
  {
    icon: PlayCircle,
    title: "Monetización digital",
    description: "Monetización en YouTube como capacidad en desarrollo",
    status: "active",
    iconColor: "#F87171",
    iconBg: "rgba(248,113,113,0.10)",
  },
  {
    icon: Zap,
    title: "TikTok",
    description: "Presencia en TikTok como capacidad en desarrollo",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: Camera,
    title: "Instagram",
    description: "Presencia en Instagram como capacidad en desarrollo",
    status: "active",
    iconColor: "#F9A8D4",
    iconBg: "rgba(249,168,212,0.10)",
  },
  {
    icon: Music2,
    title: "Facebook Music",
    description: "Presencia en Facebook como capacidad en desarrollo",
    status: "active",
    iconColor: "#93C5FD",
    iconBg: "rgba(147,197,253,0.10)",
  },
  {
    icon: Headphones,
    title: "Apple Music",
    description: "Presencia en Apple Music como capacidad en desarrollo",
    status: "active",
    iconColor: "#F87171",
    iconBg: "rgba(248,113,113,0.10)",
  },
  {
    icon: Music,
    title: "Spotify",
    description: "Planificación de tu presencia en Spotify",
    status: "active",
    iconColor: "#34D399",
    iconBg: "rgba(52,211,153,0.10)",
  },
  {
    icon: Package,
    title: "Amazon Music",
    description: "Presencia en Amazon Music como capacidad en desarrollo",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: Radio,
    title: "Deezer",
    description: "Presencia en Deezer como capacidad en desarrollo",
    status: "active",
    iconColor: "#A78BFA",
    iconBg: "rgba(167,139,250,0.10)",
  },
  {
    icon: Waves,
    title: "Tidal",
    description: "Presencia en Tidal como capacidad en desarrollo",
    status: "active",
    iconColor: "#60A5FA",
    iconBg: "rgba(96,165,250,0.10)",
  },
  {
    icon: Disc3,
    title: "Beatport",
    description: "Distribución exclusiva para música electrónica y DJ sets",
    status: "soon",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.08)",
  },
  {
    icon: LifeBuoy,
    title: "Acompañamiento",
    description: "Acompañamiento del equipo según disponibilidad",
    status: "active",
    iconColor: "#34D399",
    iconBg: "rgba(52,211,153,0.10)",
  },
  {
    icon: BarChart3,
    title: "Análisis de rendimiento",
    description: "Área prevista para consultar métricas y tendencias",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: Users,
    title: "Gestión de Artistas",
    description: "Organización de perfiles y equipos en un solo espacio",
    status: "active",
    iconColor: "#93C5FD",
    iconBg: "rgba(147,197,253,0.10)",
  },
  {
    icon: FileText,
    title: "Contratos Digitales",
    description: "Contratos digitales como capacidad en desarrollo",
    status: "soon",
    iconColor: "#A78BFA",
    iconBg: "rgba(167,139,250,0.08)",
  },
  {
    icon: UserPlus,
    title: "Invitaciones de Equipo",
    description: "Colaboración con equipos como capacidad en desarrollo",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
  {
    icon: LayoutDashboard,
    title: "Panel Administrativo",
    description: "Espacio de control para la operación del proyecto",
    status: "active",
    iconColor: "#F87171",
    iconBg: "rgba(248,113,113,0.10)",
  },
  {
    icon: BookOpen,
    title: "Gestión de Catálogo",
    description: "Organización del catálogo como capacidad en desarrollo",
    status: "active",
    iconColor: "#34D399",
    iconBg: "rgba(52,211,153,0.10)",
  },
  {
    icon: Lock,
    title: "Protección de Derechos",
    description: "Protección de derechos como capacidad en desarrollo",
    status: "soon",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.08)",
  },
  {
    icon: BadgeCheck,
    title: "Verificación de Lanzamientos",
    description: "Revisión de lanzamientos como capacidad en desarrollo",
    status: "active",
    iconColor: "#60A5FA",
    iconBg: "rgba(96,165,250,0.10)",
  },
  {
    icon: TrendingUp,
    title: "Análisis de Ingresos",
    description: "Análisis financiero como capacidad en desarrollo",
    status: "active",
    iconColor: "#F5C400",
    iconBg: "rgba(245,196,0,0.10)",
  },
];

/* duplicate for seamless infinite loop */
const LOOP = [...SERVICES, ...SERVICES];

/* ─────────────────────────────── Component ─────────────────────────────── */

export function ServicesScrollCard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="services-card-root relative w-full"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute -inset-px rounded-[22px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,196,0,0.07) 0%, transparent 70%)",
          filter: "blur(1px)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="relative rounded-[20px] overflow-hidden w-full transition-all duration-500"
        style={{
          background: "#050505",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.70), 0 2px 8px rgba(0,0,0,0.50)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="flex items-center gap-2.5">
            {/* Traffic lights */}
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] opacity-70" />
            </div>
     <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              NP Music Group — Plataforma
            </span>
          </div>

          {/* Live badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.20)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#34D399" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: "#34D399" }}
            >
              Vista de servicios
            </span>
          </div>
        </div>

        {/* Scroll container */}
        <div
          className="relative overflow-hidden"
          style={{ height: 440 }}
        >
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
            style={{
              height: 56,
              background:
                "linear-gradient(to bottom, #050505 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
            style={{
              height: 72,
              background:
                "linear-gradient(to top, #050505 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Scrolling track */}
          <div className="services-track px-2 pt-2">
            {LOOP.map((service, i) => {
              const Icon = service.icon;
              const realIndex = i % SERVICES.length;
              const isHovered = hoveredIndex === realIndex;

              return (
                <div
                  key={`${service.title}-${i}`}
                  onMouseEnter={() => setHoveredIndex(realIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex items-center gap-3.5 px-3 py-3 mb-1 rounded-[12px] cursor-default transition-all duration-200"
                  style={{
                    background: isHovered
                      ? "rgba(245,196,0,0.05)"
                      : "rgba(255,255,255,0.018)",
                    border: isHovered
                      ? "1px solid rgba(245,196,0,0.18)"
                      : "1px solid rgba(255,255,255,0.04)",
                    transform: isHovered ? "translateX(3px)" : "translateX(0)",
                    boxShadow: isHovered
                      ? "0 0 20px rgba(245,196,0,0.06), inset 0 0 0 0 transparent"
                      : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-[10px] transition-all duration-200"
                    style={{
                      width: 36,
                      height: 36,
                      background: isHovered
                        ? `rgba(245,196,0,0.12)`
                        : service.iconBg,
                      boxShadow: isHovered
                        ? `0 0 14px rgba(245,196,0,0.20)`
                        : "none",
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      style={{
                        color: isHovered ? "#F5C400" : service.iconColor,
                        transition: "color 0.2s ease",
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12.5px] font-semibold leading-tight mb-0.5 truncate transition-colors duration-200"
                      style={{
                        color: isHovered
                          ? "#F5C400"
                          : "rgba(255,255,255,0.88)",
                      }}
                    >
                      {service.title}
                    </p>
                    <p
                      className="text-[11px] leading-snug truncate"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div
                    className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-200"
                    style={
                      service.status === "active"
                        ? {
                            background: isHovered
                              ? "rgba(245,196,0,0.12)"
                              : "rgba(52,211,153,0.07)",
                            border: isHovered
                              ? "1px solid rgba(245,196,0,0.30)"
                              : "1px solid rgba(52,211,153,0.18)",
                          }
                        : {
                            background: "rgba(115,115,115,0.08)",
                            border: "1px solid rgba(115,115,115,0.15)",
                          }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          service.status === "active"
                            ? isHovered
                              ? "#F5C400"
                              : "#34D399"
                            : "#525252",
                      }}
                    />
                    <span
                      className="text-[9.5px] font-semibold hidden sm:block"
                      style={{
                        color:
                          service.status === "active"
                            ? isHovered
                              ? "#F5C400"
                              : "#34D399"
                            : "#525252",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {service.status === "active" ? "En desarrollo" : "Próximamente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <span
            className="text-[10px] font-medium"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            npmusicgroup.com
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "#F5C400", opacity: 0.6 }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: "rgba(245,196,0,0.55)" }}
            >
              Espacio de trabajo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
