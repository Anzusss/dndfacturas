/**
 * @file Formato de exportación/importación de plantillas.
 *
 * Capa: DOMINIO. Un archivo exportado es un JSON con esta forma:
 * {
 *   "format": "dndfacturas-template",
 *   "schemaVersion": 1,
 *   "exportedAt": "2026-09-27T10:00:00.000Z",
 *   "template": { ...InvoiceTemplate }
 * }
 *
 * Al importar nunca se confía en el archivo: se valida su estructura y la
 * plantilla entra SIEMPRE como borrador, versión 1.
 */

import { ELEMENT_TYPES, LEGACY_ELEMENT_TYPES } from '../constants/elementTypes';
import { isValidInvoiceType } from '../constants/invoiceTypes';
import { TEMPLATE_STATUS } from './templateLifecycle';
import { TEMPLATE_SCHEMA_VERSION, normalizeTemplate } from './invoiceTemplate';

export const EXPORT_FORMAT = 'dndfacturas-template';

/** Tipos de bloque aceptados en un archivo (actuales + antiguos). */
const KNOWN_TYPES = new Set([...Object.values(ELEMENT_TYPES), ...Object.keys(LEGACY_ELEMENT_TYPES)]);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * Construye el contenido del archivo de exportación.
 * @param {Object} template
 * @returns {Object}
 */
export const buildExportPayload = (template) => ({
  format: EXPORT_FORMAT,
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  template,
});

/**
 * Nombre de archivo sugerido para la exportación.
 * @param {Object} template
 */
export const getExportFileName = (template) => `${template.templateId}-v${template.version}.json`;

/**
 * Valida el texto de un archivo importado y devuelve la plantilla que contiene.
 * @param {string} text Contenido del archivo.
 * @returns {Object} Plantilla (sin normalizar).
 * @throws {Error} Con un mensaje legible si el archivo no es válido.
 */
export const parseImportPayload = (text) => {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }

  // Se acepta el formato de exportación, un objeto { template } o una plantilla
  // "suelta" (p. ej. copiada del visor JSON).
  const template = payload?.format === EXPORT_FORMAT || isObject(payload?.template) ? payload.template : payload;

  if ((payload?.schemaVersion ?? 0) > TEMPLATE_SCHEMA_VERSION) {
    throw new Error('El archivo es de una versión más nueva de la aplicación. Actualízala antes de importar.');
  }
  if (!isObject(template)) throw new Error('El archivo no contiene una plantilla.');
  if (!isObject(template.pageSetup)) throw new Error('La plantilla no tiene configuración de página (pageSetup).');
  if (!Array.isArray(template.elements)) throw new Error('La plantilla no tiene lista de bloques (elements).');
  if (template.invoiceType && !isValidInvoiceType(template.invoiceType)) {
    throw new Error(`Tipo de factura desconocido: "${template.invoiceType}".`);
  }

  template.elements.forEach((element, index) => {
    const position = `Bloque ${index + 1}`;
    if (!isObject(element)) throw new Error(`${position}: formato inválido.`);
    if (!KNOWN_TYPES.has(element.type)) throw new Error(`${position}: tipo desconocido "${element.type}".`);
    if (!['x', 'y', 'width', 'height'].every((key) => isFiniteNumber(element[key]))) {
      throw new Error(`${position}: posición o tamaño inválidos.`);
    }
  });

  return template;
};

/**
 * Prepara la plantilla importada para guardarla como borrador nuevo.
 * Si ya existe una plantilla con el mismo id, se importa como copia con id nuevo
 * (nunca se sobrescribe nada existente).
 *
 * @param {Object}   template
 * @param {Object}   options
 * @param {Set<string>} options.existingIds Ids de plantillas ya guardadas.
 * @param {string}   options.user
 * @returns {Object}
 */
export const prepareImportedTemplate = (template, { existingIds, user }) => {
  const now = new Date().toISOString();
  const idTaken = !template.templateId || existingIds.has(template.templateId);

  return normalizeTemplate({
    ...template,
    templateId: idTaken ? `plantilla-${Date.now()}` : template.templateId,
    name: idTaken ? `${template.name || 'Plantilla'} (importada)` : template.name,
    version: 1,
    status: TEMPLATE_STATUS.DRAFT,
    reviewComment: null,
    approvedBy: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
    updatedBy: user,
  });
};
