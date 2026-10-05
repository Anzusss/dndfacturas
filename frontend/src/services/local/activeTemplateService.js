/**
 * @file Plantilla activa por tipo de factura.
 *
 * Capa: SERVICIOS. Se guarda como un mapa aparte y no como un campo
 * `isActive` en cada plantilla: así es imposible que dos plantillas queden
 * activas para el mismo tipo. En el backend equivaldría a una tabla
 * `invoice_type_settings (invoice_type PK, template_id, template_version)`.
 *
 *   { CREDITO: { templateId, version }, CONTADO: { templateId, version } }
 */

import { INVOICE_TYPES } from '@/domain/constants/invoiceTypes';
import { DEFAULT_CONTADO_TEMPLATE_ID, DEFAULT_TEMPLATE_ID } from '@/domain/models/invoiceTemplate';
import { localStorageClient } from '../storage/localStorageClient';
import { templateService } from './templateService';

const STORAGE_KEY = 'dndfacturas_active_templates_v1';

/** Asignación inicial: las plantillas por defecto de cada tipo. */
const createSeed = () => ({
  [INVOICE_TYPES.CREDITO]: { templateId: DEFAULT_TEMPLATE_ID, version: 1 },
  [INVOICE_TYPES.CONTADO]: { templateId: DEFAULT_CONTADO_TEMPLATE_ID, version: 1 },
});

const readMap = () => {
  const stored = localStorageClient.read(STORAGE_KEY);
  if (stored && typeof stored === 'object') return stored;

  const seed = createSeed();
  localStorageClient.write(STORAGE_KEY, seed);
  return seed;
};

export const activeTemplateService = {
  /** @returns {Promise<Record<string, {templateId:string, version:number}|null>>} */
  async getActiveMap() {
    return readMap();
  },

  /**
   * Asigna la plantilla activa de un tipo. La validación (que esté aprobada,
   * que sea del mismo tipo, permisos) la hace `templateWorkflowService`.
   * @param {string} invoiceType
   * @param {{templateId:string, version:number}} ref
   */
  async setActive(invoiceType, ref) {
    localStorageClient.write(STORAGE_KEY, { ...readMap(), [invoiceType]: ref });
  },

  /**
   * Plantilla completa que se debe usar para imprimir un tipo de factura.
   * @param {string} invoiceType
   * @returns {Promise<Object|null>} `null` si no hay ninguna activa.
   */
  async getActiveTemplate(invoiceType) {
    const ref = readMap()[invoiceType];
    return ref ? templateService.getTemplate(ref.templateId, ref.version) : null;
  },
};
