import { UserPlus, Upload, Globe, DollarSign } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Regístrate",
    description: "Crea tu cuenta gratis en menos de 1 minuto. Sin tarjeta de crédito.",
  },
  {
    number: 2,
    icon: Upload,
    title: "Sube tu música",
    description: "Sube tus lanzamientos y completa la información del release.",
  },
  {
    number: 3,
    icon: Globe,
    title: "Distribuimos",
    description: "Tu música llega a todas las plataformas digitales del mundo.",
  },
  {
    number: 4,
    icon: DollarSign,
    title: "Gana ingresos",
    description: "Recibe tus pagos de forma segura, transparente y puntual.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="section-label mb-4">Cómo funciona</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            En solo 4 simples pasos.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, #1E1E1E 10%, #1E1E1E 90%, transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative flex flex-col items-start lg:items-center lg:text-center">
                {/* Number + Icon */}
                <div className="relative mb-6">
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 lg:left-8 lg:right-auto z-10 w-5 h-5 flex items-center justify-center rounded-full bg-[#F5C518] text-black text-[10px] font-bold">
                    {number}
                  </div>
                  <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E]">
                    <Icon size={28} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed max-w-xs">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
