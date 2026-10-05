/**
 * @file Roles y permisos.
 *
 * Capa: DOMINIO. Hoy el rol se elige con un selector simulado; cuando la
 * plantilla de la empresa aporte el inicio de sesión, solo cambiará de dónde
 * sale el rol del usuario, no estas reglas.
 */

export const ROLES = {
  DESIGNER: 'DISENADOR', // Diseña plantillas y las envía a revisión.
  MANAGER: 'GERENTE',    // Gerente de Tesorería/Facturación: aprueba y activa.
};

export const ROLE_LABELS = {
  [ROLES.DESIGNER]: 'Diseñador',
  [ROLES.MANAGER]: 'Gerente',
};

/** Acciones controladas por permisos. */
export const PERMISSIONS = {
  EDIT_TEMPLATES: 'EDIT_TEMPLATES',         // Crear/editar borradores y enviarlos a revisión.
  REVIEW_TEMPLATES: 'REVIEW_TEMPLATES',     // Aprobar o rechazar.
  ACTIVATE_TEMPLATES: 'ACTIVATE_TEMPLATES', // Elegir la plantilla activa de cada tipo.
  TRANSFER_TEMPLATES: 'TRANSFER_TEMPLATES', // Importar / exportar.
  PRINT_INVOICES: 'PRINT_INVOICES',         // Imprimir facturas reales.
};

/**
 * Permisos de cada rol. PENDIENTE de confirmar con la empresa quién imprime;
 * de momento ambos roles pueden hacerlo para facilitar las pruebas.
 */
const ROLE_PERMISSIONS = {
  [ROLES.DESIGNER]: [
    PERMISSIONS.EDIT_TEMPLATES,
    PERMISSIONS.TRANSFER_TEMPLATES,
    PERMISSIONS.PRINT_INVOICES,
  ],
  [ROLES.MANAGER]: Object.values(PERMISSIONS),
};

/**
 * @param {string} role
 * @param {string} permission Uno de PERMISSIONS.
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
