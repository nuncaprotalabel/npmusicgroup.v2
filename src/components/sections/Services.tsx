import { cn } from "@/utils/cn";
import { Globe, BarChart2, Users, FileText, UserPlus, Rocket } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Distribución Global",
    description:
      "Lleva tu música a más de 150 plataformas digitales en todo el mundo, de forma automática y sin complicaciones.",
  },
  {
    icon: BarChart2,
    title: "Ingresos Transparentes",
    description:
      "Datos en tiempo real sobre streams, reproducciones y rendimiento. Sin sorpresas, sin letra pequeña.",
  },
  {
    icon: Users,
    title: "Gestión de Artistas",
    description:
      "Administra artistas, roles y permisos de forma segura y transparente desde un solo panel.",
  },
  {
    icon: FileText,
    title: "Contratos Digitales",
    description:
      "Crea, firma y gestiona todos los contratos y acuerdos con tu equipo desde un solo lugar.",
  },
  {
    icon: UserPlus,
    title: "Invitaciones",
    description:
      "Invita a colaboradores y miembros del equipo a tu plataforma con permisos específicos.",
  },
  {
    icon: Rocket,
    title: "Lanzamientos",
    description:
      "Publica y gestiona tus lanzamientos con facilidad, control total y visibilidad en tiempo real.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="section-label mb-4">Todo lo que necesitas</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight max-w-lg">
              Herramientas profesionales para artistas independientes.
            </h2>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#2A2A2A] hover:bg-[#0D0D0D] transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#141414] border border-[#1E1E1E] mb-5 group-hover:border-[#F5C518]/20 group-hover:bg-[#F5C518]/6 transition-all duration-200">
                <Icon
                  size={20}
                  className="text-[#737373] group-hover:text-[#F5C518] transition-colors duration-200"
                />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-[#737373] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
