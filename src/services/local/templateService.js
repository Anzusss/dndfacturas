/**
 * @file Persistencia de plantillas (todas sus versiones).
 *
 * Capa: SERVICIOS. Hoy guarda en localStorage (mock); la interfaz asíncrona
 * está preparada para sustituirse por la API del backend.
 *
 * Solo sabe leer y escribir. Las reglas del flujo (quién puede aprobar,
 * qué se registra en el historial…) están en `templateWorkflowService`.
 */

import {
  createDefaultContadoTemplate,
  createDefaultInvoiceTemplate,
  normalizeTemplate,
} from '@/domain/models/invoiceTemplate';
import {
  getLatestVersions,
  getNextVersionNumber,
  getTemplateKey,
  isEditable,
} from '@/domain/models/templateLifecycle';
import { localStorageClient } from '../storage/localStorageClient';

/**
 * Clave de almacenamiento. Se subió a v4 al introducir versiones y estados:
 * los datos de v3 (formato anterior) se ignoran y se vuelven a sembrar.
 */
const STORAGE_KEY = 'dndfacturas_templates_v4';

/** Plantillas iniciales: una aprobada por cada tipo de factura. */
const createSeed = () => [createDefaultInvoiceTemplate(), createDefaultContadoTemplate()];

/** Lee todos los registros (sembrando la primera vez). */
const readAll = () => {
  const stored = localStorageClient.read(STORAGE_KEY);
  if (Array.isArray(stored) && stored.length > 0) return stored.map(normalizeTemplate);

  const seed = createSeed();
  localStorageClient.write(STORAGE_KEY, seed);
  return seed;
};

/** Inserta o reemplaza un registro por su clave (id + versión). */
const upsert = (records, template) => {
  const key = getTemplateKey(template);
  const exists = records.some((r) => getTemplateKey(r) === key);
  const updated = exists
    ? records.map((r) => (getTemplateKey(r) === key ? template : r))
    : [...records, template];
  localStorageClient.write(STORAGE_KEY, updated);
  return { created: !exists };
};

export const templateService = {
  /** @returns {Promise<Object[]>} Todas las versiones de todas las plantillas. */
  async getAll() {
    return readAll();
  },

  /** @returns {Promise<Object[]>} Última versión de cada plantilla. */
  async getLatest() {
    return getLatestVersions(readAll());
  },

  /**
   * @param {string} templateId
   * @param {number} version
   * @returns {Promise<Object|null>}
   */
  async getTemplate(templateId, version) {
    return readAll().find((r) => r.templateId === templateId && r.version === version) ?? null;
  },

  /** @returns {Promise<Set<string>>} Ids de plantilla existentes. */
  async getTemplateIds() {
    return new Set(readAll().map((r) => r.templateId));
  },

  /** @param {string} templateId @returns {Promise<number>} */
  async getNextVersionNumber(templateId) {
    return getNextVersionNumber(readAll(), templateId);
  },

  /**
   * Guarda un BORRADOR. Rechaza sobrescribir una versión ya enviada o aprobada,
   * aunque la llamada venga de una pantalla desactualizada.
   *
   * @param {Object} template
   * @returns {Promise<{created: boolean}>} `created` indica si el registro es nuevo.
   */
  async saveDraft(template) {
    const records = readAll();
    const stored = records.find((r) => getTemplateKey(r) === getTemplateKey(template));

    if (!isEditable(template) || (stored && !isEditable(stored))) {
      throw new Error('Solo se pueden guardar borradores. Crea una nueva versión para modificar esta plantilla.');
    }
    return upsert(records, template);
  },

  /**
   * Guarda un cambio de estado (enviar, aprobar, rechazar). Lo usa solo el
   * servicio de flujo, que ya validó la transición.
   * @param {Object} template
   */
  async updateRecord(template) {
    return upsert(readAll(), template);
  },
};
