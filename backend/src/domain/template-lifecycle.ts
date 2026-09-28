/**
 * @file Ciclo de vida de las plantillas (espejo de templateLifecycle.js del frontend).
 *
 * Capa: DOMINIO.
 *
 *   BORRADOR ──enviar──▶ EN_REVISION ──aprobar──▶ APROBADA
 *       ▲                    │ rechazar
 *       └────────────────────┘
 *
 * La base de datos aplica estas mismas reglas con triggers; aquí se validan
 * antes para devolver errores claros sin llegar a la base de datos.
 */

export const TEMPLATE_STATUS = {
  DRAFT: 'BORRADOR',
  IN_REVIEW: 'EN_REVISION',
  APPROVED: 'APROBADA',
} as const;

export type TemplateStatus = (typeof TEMPLATE_STATUS)[keyof typeof TEMPLATE_STATUS];

export const TEMPLATE_STATUS_LABELS: Record<TemplateStatus, string> = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En revisión',
  APROBADA: 'Aprobada',
};

/** Acciones que quedan en el historial de cambios. */
export const HISTORY_ACTIONS = {
  CREATED: 'CREADA',
  SAVED: 'GUARDADA',
  NEW_VERSION: 'NUEVA_VERSION',
  SUBMITTED: 'ENVIADA_REVISION',
  APPROVED: 'APROBADA',
  REJECTED: 'RECHAZADA',
  ACTIVATED: 'ACTIVADA',
  IMPORTED: 'IMPORTADA',
  EXPORTED: 'EXPORTADA',
} as const;

export type HistoryAction = (typeof HISTORY_ACTIONS)[keyof typeof HISTORY_ACTIONS];

/** Transiciones de estado permitidas. */
const ALLOWED_TRANSITIONS: Record<TemplateStatus, readonly TemplateStatus[]> = {
  BORRADOR: [TEMPLATE_STATUS.IN_REVIEW],
  EN_REVISION: [TEMPLATE_STATUS.APPROVED, TEMPLATE_STATUS.DRAFT],
  APROBADA: [],
};

/**
 * Comprueba una transición de estado.
 * @returns Mensaje de error, o `null` si la transición es válida.
 */
export const getTransitionError = (from: TemplateStatus, to: TemplateStatus): string | null =>
  ALLOWED_TRANSITIONS[from].includes(to)
    ? null
    : `No se puede pasar de "${TEMPLATE_STATUS_LABELS[from]}" a "${TEMPLATE_STATUS_LABELS[to]}".`;
