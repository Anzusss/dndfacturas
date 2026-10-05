/**
 * @file Historial de cambios de plantillas (quién hizo qué y cuándo).
 *
 * Capa: SERVICIOS. Pensado para que la gerente audite los cambios. Mock
 * sobre localStorage; en el backend sería una tabla `template_history`.
 */

import { localStorageClient } from '../storage/localStorageClient';

const STORAGE_KEY = 'dndfacturas_template_history_v1';

export const templateHistoryService = {
  /** @returns {Promise<Object[]>} Entradas, la más reciente primero. */
  async getHistory() {
    const stored = localStorageClient.read(STORAGE_KEY);
    return Array.isArray(stored) ? stored : [];
  },

  /**
   * Registra una acción sobre una plantilla.
   * @param {Object} params
   * @param {Object} params.template Registro afectado (se guardan id, versión, nombre y tipo).
   * @param {string} params.action   Uno de HISTORY_ACTIONS.
   * @param {string} params.user
   * @param {string} [params.comment]
   */
  async record({ template, action, user, comment = null }) {
    const entry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      templateId: template.templateId,
      templateName: template.name,
      version: template.version,
      invoiceType: template.invoiceType,
      action,
      user,
      comment,
      at: new Date().toISOString(),
    };
    const history = await this.getHistory();
    localStorageClient.write(STORAGE_KEY, [entry, ...history]);
    return entry;
  },
};
