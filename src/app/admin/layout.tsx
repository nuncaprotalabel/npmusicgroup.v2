import { redirect } from "next/navigation";
import { AuthorizationError, requirePermission } from "@/lib/authorization";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeaderWrapper } from "@/components/dashboard/DashboardHeaderWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await requirePermission("dashboard.view");
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "#000000" }}>
        <DashboardSidebar role={session.role} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeaderWrapper username={session.username} role={session.role} />
          <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401) {
      redirect("/login?from=/admin");
    }
    redirect("/403");
  }
}