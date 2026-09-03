import { InDevelopment, type DashboardModuleKey } from "@/components/dashboard/InDevelopment";

interface AdminModulePageProps {
  moduleKey: DashboardModuleKey;
}

/**
 * Shell shared by admin modules that do not have connected records yet.
 * It deliberately renders no sample rows, counters, or action buttons.
 */
export function AdminModulePage({ moduleKey }: AdminModulePageProps) {
  return <InDevelopment moduleKey={moduleKey} />;
}