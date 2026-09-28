/**
 * @file Validación de la estructura de una plantilla (diseño) y del formato
 * de importación (espejo de templateTransfer.js del frontend).
 *
 * Capa: DOMINIO. Nunca se confía en lo que envía el cliente: se valida aquí
 * antes de guardar, además de las restricciones de la base de datos.
 */

/** Objeto JSON (ver common/types/json.types.ts). */
type JsonObject = Record<string, any>;

/** Formato del archivo de exportación/importación. */
export const EXPORT_FORMAT = 'dndfacturas-template';

/** Versión del formato del JSON de plantilla que entiende este backend. */
export const TEMPLATE_SCHEMA_VERSION = 1;

/** Tipos de bloque admitidos (actuales + antiguos que el frontend migra). */
const KNOWN_ELEMENT_TYPES = new Set(['grid', 'table', 'totals', 'text', 'variable', 'line', 'logo', 'LINE']);

/** Máximo de bloques por plantilla (protección frente a cargas absurdas). */
const MAX_ELEMENTS = 500;

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isFiniteNumber = (value: unknown): boolean => typeof value === 'number' && Number.isFinite(value);

/**
 * Valida la lista de bloques de una plantilla.
 * @returns Lista de errores (vacía si es válida).
 */
export const validateElements = (elements: unknown): string[] => {
  if (!Array.isArray(elements)) return ['La plantilla no tiene lista de bloques (elements).'];
  if (elements.length > MAX_ELEMENTS) return [`La plantilla supera el máximo de ${MAX_ELEMENTS} bloques.`];

  const errors: string[] = [];
  elements.forEach((element, index) => {
    const position = `Bloque ${index + 1}`;
    if (!isObject(element)) {
      errors.push(`${position}: formato inválido.`);
      return;
    }
    if (typeof element.id !== 'string' || !element.id) errors.push(`${position}: falta el id.`);
    if (!KNOWN_ELEMENT_TYPES.has(element.type as string)) errors.push(`${position}: tipo desconocido "${String(element.type)}".`);
    if (!['x', 'y', 'width', 'height'].every((key) => isFiniteNumber(element[key]))) {
      errors.push(`${position}: posición o tamaño inválidos.`);
    }
  });
  return errors;
};

/** Plantilla contenida en un archivo de importación (sin normalizar). */
export interface ImportedTemplate {
  templateId?: string;
  name?: string;
  invoiceType?: string;
  pageSetup: JsonObject;
  elements: JsonObject[];
  [key: string]: unknown;
}

/**
 * Extrae y valida la plantilla de un archivo de importación.
 * Acepta el formato de exportación, `{ template }` o una plantilla suelta.
 *
 * @throws Error con un mensaje legible si no es válida.
 */
export const parseImportPayload = (payload: unknown): ImportedTemplate => {
  const wrapper = isObject(payload) ? payload : {};
  const template = wrapper.format === EXPORT_FORMAT || isObject(wrapper.template) ? wrapper.template : payload;

  if (Number(wrapper.schemaVersion ?? 0) > TEMPLATE_SCHEMA_VERSION) {
    throw new Error('El archivo es de una versión más nueva de la aplicación.');
  }
  if (!isObject(template)) throw new Error('El archivo no contiene una plantilla.');
  if (!isObject(template.pageSetup)) throw new Error('La plantilla no tiene configuración de página (pageSetup).');

  const errors = validateElements(template.elements);
  if (errors.length > 0) throw new Error(errors.join(' '));

  return template as ImportedTemplate;
};
