import Image from "next/image";
import { PlatformsBar } from "./PlatformsBar";

const stats = [
  { value: "+150", label: "Plataformas digitales" },
  { value: "+2.000", label: "Artistas activos" },
  { value: "+10M", label: "Streams distribuidos" },
  { value: "99.9%", label: "Uptime garantizado" },
];

export function Stats() {
  return (
    <section id="distribucion">
      {/* Platforms */}
      <PlatformsBar label="Distribución sin límites — Llega a más lugares." />

      {/* Stats Bar */}
      <div className="bg-[#050505] border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 items-center">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p
                  className="text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight"
                  style={{ color: "#F5C518" }}
                >
                  {value}
                </p>
                <p className="text-sm text-[#737373]">{label}</p>
              </div>
            ))}

            {/* Brand badge */}
            <div className="col-span-2 lg:col-span-1 flex flex-col lg:items-end items-center gap-3 mt-2 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative shrink-0">
                  <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Hecho para artistas reales.</p>
                  <p className="text-xs text-[#737373] leading-tight">Por artistas reales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
