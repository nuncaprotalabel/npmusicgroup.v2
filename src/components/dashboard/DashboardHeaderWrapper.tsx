"use client";

/**
 * DashboardHeaderWrapper — wrapper client para DashboardHeader.
 * Gestiona el estado del drawer móvil y lo pasa al sidebar y al header.
 * Necesario porque el layout es Server Component pero el estado es client-side.
 */
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMobileSidebar } from "@/components/dashboard/DashboardMobileSidebar";
import type { UserRole } from "@/types/auth";

interface DashboardHeaderWrapperProps {
  username: string;
  role: UserRole;
}

export function DashboardHeaderWrapper({ username, role }: DashboardHeaderWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <DashboardHeader
        username={username}
        role={role}
        onMenuToggle={() => setMobileOpen(true)}
      />
      <DashboardMobileSidebar
        role={role}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
