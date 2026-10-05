/**
 * @file Casos de uso del flujo de plantillas: guardar, enviar a revisión,
 * aprobar, rechazar, activar, crear versión, importar y exportar.
 *
 * Capa: SERVICIOS (aplicación). Orquesta los servicios de datos y aplica:
 * - Permisos del usuario (aunque la UI ya oculte los botones no permitidos).
 * - Transiciones válidas del ciclo de vida (dominio).
 * - Registro de cada acción en el historial.
 *
 * Todas las funciones reciben `user` = { email, role } (hoy simulado).
 */

import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';
import { PERMISSIONS, hasPermission } from '@/domain/models/permissions';
import {
  HISTORY_ACTIONS,
  TEMPLATE_STATUS,
  approveTemplate,
  createNextVersion,
  rejectTemplate,
  submitForReview,
} from '@/domain/models/templateLifecycle';
import {
  buildExportPayload,
  parseImportPayload,
  prepareImportedTemplate,
} from '@/domain/models/templateTransfer';
import { templateService } from './templateService';
import { activeTemplateService } from './activeTemplateService';
import { templateHistoryService } from './templateHistoryService';

/** Lanza un error si el usuario no tiene el permiso. */
const requirePermission = (user, permission) => {
  if (!hasPermission(user.role, permission)) {
    throw new Error('No tienes permiso para realizar esta acción.');
  }
};

/** Obtiene la versión guardada (la fuente de verdad, no la copia de la pantalla). */
const getStoredOrThrow = async ({ templateId, version }) => {
  const stored = await templateService.getTemplate(templateId, version);
  if (!stored) throw new Error('La plantilla no está guardada. Guárdala antes de continuar.');
  return stored;
};

export const templateWorkflowService = {
  /**
   * Guarda un borrador y registra si se creó, si es una versión nueva o si se editó.
   * @returns {Promise<Object>} La plantilla guardada.
   */
  async saveDraft(template, user) {
    requirePermission(user, PERMISSIONS.EDIT_TEMPLATES);

    const toSave = { ...template, updatedBy: user.email, updatedAt: new Date().toISOString() };
    const { created } = await templateService.saveDraft(toSave);

    let action = HISTORY_ACTIONS.SAVED;
    if (created) action = toSave.version > 1 ? HISTORY_ACTIONS.NEW_VERSION : HISTORY_ACTIONS.CREATED;
    await templateHistoryService.record({ template: toSave, action, user: user.email });
    return toSave;
  },

  /** Guarda (si hace falta) y envía un borrador a revisión. */
  async submitForReview(template, user) {
    requirePermission(user, PERMISSIONS.EDIT_TEMPLATES);
    const stored = await getStoredOrThrow(template);
    const updated = submitForReview(stored, user.email);

    await templateService.updateRecord(updated);
    await templateHistoryService.record({ template: updated, action: HISTORY_ACTIONS.SUBMITTED, user: user.email });
    return updated;
  },

  /** Aprueba una versión en revisión. */
  async approve(template, user) {
    requirePermission(user, PERMISSIONS.REVIEW_TEMPLATES);
    const updated = approveTemplate(await getStoredOrThrow(template), user.email);

    await templateService.updateRecord(updated);
    await templateHistoryService.record({ template: updated, action: HISTORY_ACTIONS.APPROVED, user: user.email });
    return updated;
  },

  /** Rechaza una versión en revisión (vuelve a borrador con el motivo). */
  async reject(template, user, comment) {
    requirePermission(user, PERMISSIONS.REVIEW_TEMPLATES);
    const updated = rejectTemplate(await getStoredOrThrow(template), user.email, comment);

    await templateService.updateRecord(updated);
    await templateHistoryService.record({
      template: updated,
      action: HISTORY_ACTIONS.REJECTED,
      user: user.email,
      comment,
    });
    return updated;
  },

  /**
   * Activa una versión aprobada para su tipo de factura.
   * Desde ese momento, las facturas de ese tipo se imprimen con ella.
   */
  async activate(template, user) {
    requirePermission(user, PERMISSIONS.ACTIVATE_TEMPLATES);
    const stored = await getStoredOrThrow(template);

    if (stored.status !== TEMPLATE_STATUS.APPROVED) {
      throw new Error('Solo se pueden activar plantillas aprobadas.');
    }
    await activeTemplateService.setActive(stored.invoiceType, {
      templateId: stored.templateId,
      version: stored.version,
    });
    await templateHistoryService.record({
      template: stored,
      action: HISTORY_ACTIONS.ACTIVATED,
      user: user.email,
      comment: `Activa para facturas de ${INVOICE_TYPE_LABELS[stored.invoiceType]}`,
    });
    return stored;
  },

  /**
   * Prepara (sin guardar) la siguiente versión en borrador de una plantilla.
   * Se guarda cuando el usuario pulsa "Guardar" en el editor.
   */
  async prepareNextVersion(template, user) {
    requirePermission(user, PERMISSIONS.EDIT_TEMPLATES);
    const nextVersion = await templateService.getNextVersionNumber(template.templateId);
    return createNextVersion(template, nextVersion, user.email);
  },

  /** Devuelve el contenido del archivo de exportación y lo registra. */
  async exportTemplate(template, user) {
    requirePermission(user, PERMISSIONS.TRANSFER_TEMPLATES);
    await templateHistoryService.record({ template, action: HISTORY_ACTIONS.EXPORTED, user: user.email });
    return buildExportPayload(template);
  },

  /**
   * Importa una plantilla desde el texto de un archivo. Entra como borrador
   * nuevo; si el id ya existe se importa como copia.
   * @param {string} fileText
   */
  async importTemplate(fileText, user) {
    requirePermission(user, PERMISSIONS.TRANSFER_TEMPLATES);
    const parsed = parseImportPayload(fileText);
    const template = prepareImportedTemplate(parsed, {
      existingIds: await templateService.getTemplateIds(),
      user: user.email,
    });

    await templateService.saveDraft(template);
    await templateHistoryService.record({ template, action: HISTORY_ACTIONS.IMPORTED, user: user.email });
    return template;
  },
};
