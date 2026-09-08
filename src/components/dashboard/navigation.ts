import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  DollarSign,
  MessageSquare,
  UserCog,
  UserRound,
  ShieldCheck,
  Settings,
  Mail,
  Send,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/auth";
import type { Translations } from "@/i18n/translations";

export type DashboardModuleKey = keyof Translations["dashboard"]["modules"];
export type DashboardGroupKey = keyof Translations["dashboard"]["sidebar"];

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string }[];
  roles?: UserRole[];
}

export interface NavigationGroup {
  group: string;
  items: NavigationItem[];
}

interface NavigationDefinition {
  group: DashboardGroupKey;
  items: {
    href: string;
    label: DashboardModuleKey;
    icon: LucideIcon;
    children?: { href: string; label: DashboardModuleKey }[];
    roles?: UserRole[];
  }[];
}

const NAVIGATION: NavigationDefinition[] = [
  {
    group: "platform",
    items: [
      { href: "/dashboard/central", label: "central", icon: LayoutDashboard },
      { href: "/dashboard/perfil", label: "profile", icon: UserRound, roles: ["ARTIST"] },
      { href: "/dashboard/releases", label: "releases", icon: Send, roles: ["ARTIST"] },
    ],
  },
  {
    group: "management",
    items: [
      { href: "/admin/artistas", label: "artists", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
      { href: "/admin/solicitudes", label: "requests", icon: Inbox, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
      { href: "/admin/invitaciones", label: "invitations", icon: Mail, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
      { href: "/admin/contratos", label: "contracts", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
      {
        href: "/admin/lanzamientos",
        label: "releases",
        icon: Send,
        roles: ["SUPER_ADMIN", "ADMIN", "DISTRIBUTION_MANAGER", "MANAGER"],
        children: [{ href: "/admin/recibidos", label: "releasesReceived" }],
      },
    ],
  },
  {
    group: "finance",
    items: [
      { href: "/admin/analiticas", label: "analytics", icon: BarChart2, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/ingresos", label: "revenue", icon: DollarSign, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/mensajes", label: "messaging", icon: MessageSquare, roles: ["SUPER_ADMIN", "ADMIN"] },
    ],
  },
  {
    group: "system",
    items: [
      { href: "/admin/cuentas", label: "accounts", icon: UserCog, roles: ["SUPER_ADMIN", "ADMIN"] },
      { href: "/admin/permisos", label: "permissions", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
      { href: "/admin/configuracion", label: "settings", icon: Settings, roles: ["SUPER_ADMIN"] },
    ],
  },
];

export function getNavigationGroups(t: Translations, role?: UserRole): NavigationGroup[] {
  return NAVIGATION.map(({ group, items }) => ({
    group: t.dashboard.sidebar[group],
    items: items
      .filter(({ roles }) => !role || !roles || roles.includes(role))
      .map(({ label, children, ...item }) => ({
      ...item,
      label: t.dashboard.modules[label],
      ...(children
        ? {
            children: children.map(({ label: childLabel, ...child }) => ({
              ...child,
              label: t.dashboard.modules[childLabel],
            })),
          }
        : {}),
      })),
  })).filter(({ items }) => items.length > 0);
}

export function getNavigationGroupsForRole(t: Translations, role: UserRole): NavigationGroup[] {
  return getNavigationGroups(t, role);
}

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href || pathname === "/dashboard" || pathname === "/dashboard/central";
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function isNavigationChildActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}