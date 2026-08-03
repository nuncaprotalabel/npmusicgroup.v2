import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Vista general en tiempo real",
  "Gráficos y análisis detallados",
  "Acciones rápidas y sencillas",
  "Diseñado para móviles",
];

export function DashboardPreviewSection() {
  return (
    <section id="plataforma" className="py-24 lg:py-32 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <p className="section-label mb-4">Panel profesional</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
              Tu plataforma,<br />
              tus datos,<br />
              <span style={{ color: "#F5C518" }}>tu control.</span>
            </h2>
            <p className="text-base text-[#737373] leading-relaxed mb-8 max-w-md">
              Un panel intuitivo y moderno que te permite gestionar todo tu negocio musical desde un solo lugar, con datos en tiempo real.
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="shrink-0" style={{ color: "#F5C518" }} />
                  <span className="text-sm text-[#A3A3A3]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dashboard */}
          <div className="order-1 lg:order-2 relative">
            <div
              className="absolute -inset-6 rounded-2xl opacity-[0.04] blur-[80px] pointer-events-none"
              style={{ background: "#F5C518" }}
            />
            <div className="relative">
              <DashboardPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
