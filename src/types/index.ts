export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface Platform {
  name: string;
  slug: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface DashboardStat {
  label: string;
  value: string | null;
  change?: string | null;
  changePositive?: boolean;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}
