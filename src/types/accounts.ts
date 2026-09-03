import type { UserRole } from "@/types/auth";

export interface Account {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CreateAccountInput {
  username: string;
  email: string;
  role: UserRole;
}

export interface UpdateAccountInput {
  username?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateAccountResult {
  account?: Account;
  setupUrl?: string;
  expiresAt?: string;
  error?: string;
}

export const ACCOUNT_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "DISTRIBUTION_MANAGER",
  "MANAGER",
  "ARTIST",
  "VIEWER",
];

export const ACCOUNT_ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN: "Administrador",
  DISTRIBUTION_MANAGER: "Gestor de Distribución",
  MANAGER: "Manager",
  ARTIST: "Artista",
  VIEWER: "Observador",
};