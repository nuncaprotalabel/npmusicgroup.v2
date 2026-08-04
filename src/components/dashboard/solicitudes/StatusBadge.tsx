/**
 * StatusBadge — muestra el estado de una solicitud con color semántico.
 */
import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@/types/application";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { variant: "warning" | "success" | "error"; label: string }> = {
  PENDIENTE:  { variant: "warning", label: "Pendiente"  },
  APROBADA:   { variant: "success", label: "Aprobada"   },
  RECHAZADA:  { variant: "error",   label: "Rechazada"  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { variant: "neutral" as const, label: status };
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
