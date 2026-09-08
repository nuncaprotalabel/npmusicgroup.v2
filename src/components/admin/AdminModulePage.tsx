import { InDevelopment, type DashboardModuleKey } from "@/components/dashboard/InDevelopment";
import { redirect } from "next/navigation";
import { AuthorizationError, requirePermission } from "@/lib/authorization";
import type { Permission } from "@/lib/permissions";

interface AdminModulePageProps {
  moduleKey: DashboardModuleKey;
}

const MODULE_PERMISSIONS: Partial<Record<DashboardModuleKey, Permission>> = {
  analytics: "analytics.view",
  revenue: "income.view",
  messaging: "messages.view",
  permissions: "roles.view",
  settings: "settings.view",
  releasesReceived: "releases.view",
};

export async function requireAdminModulePermission(permission: Permission, from: string) {
  try {
    return await requirePermission(permission);
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401) {
      redirect(`/login?from=${encodeURIComponent(from)}`);
    }
    redirect("/403");
  }
}

/**
 * Shell shared by admin modules that do not have connected records yet.
 * It deliberately renders no sample rows, counters, or action buttons.
 */
export async function AdminModulePage({ moduleKey }: AdminModulePageProps) {
  const permission = MODULE_PERMISSIONS[moduleKey];
  if (!permission) {
    redirect("/403");
  }

  await requireAdminModulePermission(permission, `/admin/${moduleKey}`);

  return <InDevelopment moduleKey={moduleKey} />;
}