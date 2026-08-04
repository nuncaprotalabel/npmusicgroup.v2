"use client";

/**
 * ConfirmDialog — diálogo de confirmación antes de aprobar o rechazar una solicitud.
 */
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ConfirmDialogProps {
  action:    "APROBADA" | "RECHAZADA";
  artisticName: string;
  loading:   boolean;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmDialog({ action, artisticName, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  const isApprove = action === "APROBADA";
  const dialogRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loading, onCancel]);

  // Focus trap básico
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-sm rounded-2xl border outline-none"
        style={{ background: "#0A0A0A", borderColor: "#1E1E1E" }}
      >
        {/* Icono + título */}
        <div className="flex flex-col items-center pt-8 px-6 pb-5 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ background: isApprove ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)" }}
          >
            {isApprove ? (
              <CheckCircle size={22} style={{ color: "#10B981" }} />
            ) : (
              <AlertTriangle size={22} style={{ color: "#EF4444" }} />
            )}
          </div>

          <p className="text-[1rem] font-semibold text-white mb-1">
            {isApprove ? "Confirmar aprobación" : "Confirmar rechazo"}
          </p>
          <p className="text-sm" style={{ color: "#737373" }}>
            {isApprove
              ? <>¿Aprobar la solicitud de <span className="text-white font-medium">{artisticName}</span>?</>
              : <>¿Rechazar la solicitud de <span className="text-white font-medium">{artisticName}</span>? Esta acción quedará registrada en la auditoría.</>
            }
          </p>
        </div>

        {/* Acciones */}
        <div
          className="flex gap-2 px-6 pb-6"
        >
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant={isApprove ? "primary" : "danger"}
            size="sm"
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            {isApprove ? "Aprobar" : "Rechazar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
