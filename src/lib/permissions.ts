/**
 * Sistema de roles y permisos de NP Music Group.
 * Fuente de verdad para validaciones de autorización en el servidor.
 */
import type { UserRole } from '@/types/auth';

// ─── Jerarquía de roles (menor = más privilegios) ────────────────────────────

export const ROLE_LEVEL: Record<UserRole, number> = {
  SUPER_ADMIN:          1,
  ADMIN:                2,
  DISTRIBUTION_MANAGER: 3,
  MANAGER:              4,
  ARTIST:               5,
  VIEWER:               6,
};

// ─── Permisos por módulo ──────────────────────────────────────────────────────

export type Permission =
  | 'system.view'         | 'system.manage'
  | 'users.view'          | 'users.create'      | 'users.update'    | 'users.delete'    | 'users.manage'
  | 'artists.view'        | 'artists.create'    | 'artists.update'  | 'artists.delete'  | 'artists.manage'
  | 'releases.view'       | 'releases.create'   | 'releases.update' | 'releases.delete' | 'releases.manage'
  | 'distribution.view'   | 'distribution.manage'
  | 'revenue.view'        | 'revenue.manage'
  | 'contracts.view'      | 'contracts.manage'
  | 'analytics.view'      | 'analytics.manage'
  | 'invitations.view'    | 'invitations.create' | 'invitations.manage'
  | 'audit.view';

// Permisos estáticos por rol (caché en memoria, en sync con la DB)
const ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  SUPER_ADMIN: new Set([
    'system.view', 'system.manage',
    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage',
    'artists.view', 'artists.create', 'artists.update', 'artists.delete', 'artists.manage',
    'releases.view', 'releases.create', 'releases.update', 'releases.delete', 'releases.manage',
    'distribution.view', 'distribution.manage',
    'revenue.view', 'revenue.manage',
    'contracts.view', 'contracts.manage',
    'analytics.view', 'analytics.manage',
    'invitations.view', 'invitations.create', 'invitations.manage',
    'audit.view',
  ]),
  ADMIN: new Set([
    'system.view',
    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage',
    'artists.view', 'artists.create', 'artists.update', 'artists.delete', 'artists.manage',
    'releases.view', 'releases.create', 'releases.update', 'releases.delete', 'releases.manage',
    'distribution.view', 'distribution.manage',
    'revenue.view', 'revenue.manage',
    'contracts.view', 'contracts.manage',
    'analytics.view', 'analytics.manage',
    'invitations.view', 'invitations.create', 'invitations.manage',
    'audit.view',
  ]),
  DISTRIBUTION_MANAGER: new Set([
    'artists.view',
    'releases.view', 'releases.create', 'releases.update', 'releases.manage',
    'distribution.view', 'distribution.manage',
    'analytics.view',
    'revenue.view',
  ]),
  MANAGER: new Set([
    'artists.view', 'artists.create', 'artists.update', 'artists.manage',
    'releases.view',
    'analytics.view',
    'revenue.view',
    'contracts.view',
  ]),
  ARTIST: new Set([
    'artists.view',
    'releases.view',
    'revenue.view',
    'analytics.view',
  ]),
  VIEWER: new Set([
    'artists.view',
    'releases.view',
    'analytics.view',
  ]),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Verifica si un rol tiene un permiso específico. */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

/** Verifica si un rol tiene todos los permisos indicados. */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

/** Retorna true si roleA tiene el mismo nivel o más privilegios que roleB. */
export function isRoleAtLeast(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_LEVEL[roleA] <= ROLE_LEVEL[roleB];
}

/** Retorna todos los permisos de un rol. */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return Array.from(ROLE_PERMISSIONS[role] ?? []);
}

/** Etiquetas en español para los roles. */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN:          'Super Administrador',
  ADMIN:                'Administrador',
  DISTRIBUTION_MANAGER: 'Gestor de Distribución',
  MANAGER:              'Manager',
  ARTIST:               'Artista',
  VIEWER:               'Observador',
};
