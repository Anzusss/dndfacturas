/**
 * @file Roles y permisos (espejo de src/domain/models/permissions.js del frontend).
 *
 * Capa: DOMINIO. Si cambias los permisos, cámbialos también en el frontend
 * (allí solo ocultan botones; aquí es donde realmente se aplican).
 */

export const ROLES = {
  DESIGNER: 'DISENADOR',
  MANAGER: 'GERENTE',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  EDIT_TEMPLATES: 'EDIT_TEMPLATES',
  REVIEW_TEMPLATES: 'REVIEW_TEMPLATES',
  ACTIVATE_TEMPLATES: 'ACTIVATE_TEMPLATES',
  TRANSFER_TEMPLATES: 'TRANSFER_TEMPLATES',
  PRINT_INVOICES: 'PRINT_INVOICES',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Permisos de cada rol. PENDIENTE confirmar con la empresa quién imprime. */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.DESIGNER]: [PERMISSIONS.EDIT_TEMPLATES, PERMISSIONS.TRANSFER_TEMPLATES, PERMISSIONS.PRINT_INVOICES],
  [ROLES.MANAGER]: Object.values(PERMISSIONS),
};

/** @returns `true` si el valor es un rol conocido. */
export const isRole = (value: unknown): value is Role => Object.values(ROLES).includes(value as Role);

/** @returns `true` si el rol tiene el permiso. */
export const hasPermission = (role: Role | undefined, permission: Permission): boolean =>
  role ? ROLE_PERMISSIONS[role].includes(permission) : false;
