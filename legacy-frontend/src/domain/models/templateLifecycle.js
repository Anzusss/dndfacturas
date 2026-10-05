/**
 * @file Ciclo de vida y versiones de las plantillas.
 *
 * Capa: DOMINIO.
 *
 *   BORRADOR ──enviar──▶ EN_REVISION ──aprobar──▶ APROBADA ──activar──▶ (activa para su tipo)
 *       ▲                    │ rechazar
 *       └────────────────────┘
 *
 * Reglas clave:
 * - Solo los BORRADORES se pueden editar.
 * - Una versión aprobada nunca cambia: para modificarla se crea la versión
 *   siguiente como borrador, y la aprobada sigue imprimiéndose mientras tanto.
 * - Cada registro se identifica por `templateId` + `version`.
 */

export const TEMPLATE_STATUS = {
  DRAFT: 'BORRADOR',
  IN_REVIEW: 'EN_REVISION',
  APPROVED: 'APROBADA',
};

export const TEMPLATE_STATUS_LABELS = {
  [TEMPLATE_STATUS.DRAFT]: 'Borrador',
  [TEMPLATE_STATUS.IN_REVIEW]: 'En revisión',
  [TEMPLATE_STATUS.APPROVED]: 'Aprobada',
};

/** Acciones que quedan registradas en el historial de cambios. */
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
};

export const HISTORY_ACTION_LABELS = {
  [HISTORY_ACTIONS.CREATED]: 'Creada',
  [HISTORY_ACTIONS.SAVED]: 'Guardada',
  [HISTORY_ACTIONS.NEW_VERSION]: 'Nueva versión',
  [HISTORY_ACTIONS.SUBMITTED]: 'Enviada a revisión',
  [HISTORY_ACTIONS.APPROVED]: 'Aprobada',
  [HISTORY_ACTIONS.REJECTED]: 'Rechazada',
  [HISTORY_ACTIONS.ACTIVATED]: 'Activada',
  [HISTORY_ACTIONS.IMPORTED]: 'Importada',
  [HISTORY_ACTIONS.EXPORTED]: 'Exportada',
};

/**
 * Clave única de un registro de plantilla.
 * @param {{templateId:string, version:number}} template
 * @returns {string} p. ej. "factura-fiscal-real-v1@v3"
 */
export const getTemplateKey = (template) => `${template.templateId}@v${template.version}`;

/** @returns {boolean} `true` si la plantilla se puede editar (solo borradores). */
export const isEditable = (template) => template?.status === TEMPLATE_STATUS.DRAFT;

/** Marca de tiempo y autor de la última modificación. */
const stamp = (user) => ({ updatedBy: user, updatedAt: new Date().toISOString() });

/**
 * Lanza un error si la plantilla no está en el estado esperado.
 * Protege las transiciones aunque la UI ya oculte los botones no permitidos.
 */
const assertStatus = (template, expected, action) => {
  if (template.status !== expected) {
    throw new Error(
      `No se puede ${action}: la plantilla está "${TEMPLATE_STATUS_LABELS[template.status] ?? template.status}".`,
    );
  }
};

/** BORRADOR → EN_REVISION. */
export const submitForReview = (template, user) => {
  assertStatus(template, TEMPLATE_STATUS.DRAFT, 'enviar a revisión');
  return { ...template, status: TEMPLATE_STATUS.IN_REVIEW, reviewComment: null, ...stamp(user) };
};

/** EN_REVISION → APROBADA. */
export const approveTemplate = (template, user) => {
  assertStatus(template, TEMPLATE_STATUS.IN_REVIEW, 'aprobar');
  const now = new Date().toISOString();
  return { ...template, status: TEMPLATE_STATUS.APPROVED, approvedBy: user, approvedAt: now, reviewComment: null };
};

/** EN_REVISION → BORRADOR, guardando el motivo para el diseñador. */
export const rejectTemplate = (template, user, comment) => {
  assertStatus(template, TEMPLATE_STATUS.IN_REVIEW, 'rechazar');
  return { ...template, status: TEMPLATE_STATUS.DRAFT, reviewComment: comment || null, ...stamp(user) };
};

/**
 * Crea la versión siguiente (borrador) a partir de una versión existente.
 * @param {Object} template    Versión de origen (normalmente la aprobada).
 * @param {number} nextVersion Número de la nueva versión.
 * @param {string} user
 */
export const createNextVersion = (template, nextVersion, user) => ({
  ...structuredClone(template),
  version: nextVersion,
  status: TEMPLATE_STATUS.DRAFT,
  approvedBy: null,
  approvedAt: null,
  reviewComment: null,
  ...stamp(user),
});

/**
 * Número de la próxima versión de una plantilla.
 * @param {Object[]} records Todos los registros guardados.
 * @param {string} templateId
 */
export const getNextVersionNumber = (records, templateId) =>
  Math.max(0, ...records.filter((r) => r.templateId === templateId).map((r) => r.version)) + 1;

/**
 * Devuelve solo la última versión de cada plantilla (para los listados),
 * conservando el orden de aparición.
 * @param {Object[]} records
 * @returns {Object[]}
 */
export const getLatestVersions = (records) => {
  const latest = new Map();
  for (const record of records) {
    const current = latest.get(record.templateId);
    if (!current || record.version > current.version) latest.set(record.templateId, record);
  }
  return [...latest.values()];
};
