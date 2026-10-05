/**
 * @file Datos de una factura (InvoiceData) y su enlace con las plantillas.
 *
 * Capa: DOMINIO. Funciones puras para:
 * - Leer un valor por ruta ("totales.ivaUsd").
 * - Sustituir `{{variables}}` dentro de un texto.
 * - Saber qué campos usa una plantilla y cuáles faltan en una factura
 *   (clave para probar la API: avisa antes de imprimir si algo no llegó).
 */

import { isValidInvoiceType } from '../constants/invoiceTypes';
import { ELEMENT_TYPES } from '../constants/elementTypes';

/**
 * Formato interno de una factura. Lo produce la capa de traducción de la API
 * y lo consumen los bloques al dibujar la factura.
 *
 * @typedef {Object} InvoiceData
 * @property {'CREDITO'|'CONTADO'|null} invoiceType
 * @property {string} facturaNo
 * @property {Object[]} items   Renglones (ver ITEM_FIELDS).
 * @property {Object} totales   Totales (ver TOTAL_FIELDS).
 * Además, un campo por cada variable de cabecera (cliente, rif, fecha…).
 */

/** Expresión de las variables dentro de un texto: {{ruta}} o {{ ruta }}. */
const PLACEHOLDER_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g;

/**
 * Lee un valor por ruta con puntos. Devuelve `undefined` si algún tramo no existe.
 * @param {Object} data
 * @param {string} path p. ej. "totales.ivaUsd"
 */
export const getValueByPath = (data, path) =>
  path.split('.').reduce((current, key) => (current == null ? undefined : current[key]), data);

/** @returns {boolean} `true` si el valor cuenta como "no llegó". */
const isMissing = (value) => value === undefined || value === null || value === '';

/**
 * Sustituye las `{{variables}}` de un texto.
 *
 * @param {string} text
 * @param {Object} data
 * @param {(value:any, path:string) => string} [format] Cómo convertir cada valor a texto.
 * @param {(match:string) => string} [onMissing] Qué poner si el dato no llegó:
 *   por defecto se deja `{{campo}}` para que se note en el editor; al imprimir
 *   se pasa `() => ''` para no imprimir marcadores en el papel.
 * @returns {string}
 */
export const interpolateText = (text = '', data, format = (value) => String(value), onMissing = (match) => match) =>
  text.replace(PLACEHOLDER_REGEX, (match, path) => {
    const value = getValueByPath(data, path);
    return isMissing(value) ? onMissing(match) : format(value, path);
  });

/**
 * Extrae las rutas `{{...}}` usadas en un texto.
 * @param {string} text
 * @returns {string[]}
 */
const extractPlaceholders = (text = '') => [...text.matchAll(PLACEHOLDER_REGEX)].map((match) => match[1]);

/**
 * Reúne todos los campos que usa una plantilla. Los campos de renglón se
 * devuelven como `items[].campo`.
 *
 * @param {Object} template
 * @returns {string[]} Rutas únicas.
 */
export const collectTemplateBindings = (template) => {
  const paths = new Set();

  for (const element of template.elements ?? []) {
    switch (element.type) {
      case ELEMENT_TYPES.GRID:
        element.fields?.forEach((field) => paths.add(field));
        break;
      case ELEMENT_TYPES.VARIABLE:
        if (element.variableKey) paths.add(element.variableKey);
        break;
      case ELEMENT_TYPES.TABLE:
        element.columns?.forEach((column) => column.field && paths.add(`items[].${column.field}`));
        break;
      case ELEMENT_TYPES.TOTALS:
        element.totalsRows?.forEach((row) => {
          if (row.usdKey) paths.add(row.usdKey);
          if (row.bsKey) paths.add(row.bsKey);
        });
        break;
      case ELEMENT_TYPES.TEXT:
        extractPlaceholders(element.content).forEach((path) => paths.add(path));
        break;
      default:
        break;
    }
  }
  return [...paths];
};

/**
 * Campos que la plantilla usa pero que la factura no trae.
 * Para los renglones basta con que falte en alguno.
 *
 * @param {Object} template
 * @param {InvoiceData} data
 * @returns {string[]}
 */
export const findMissingBindings = (template, data) =>
  collectTemplateBindings(template).filter((path) => {
    if (!path.startsWith('items[].')) return isMissing(getValueByPath(data, path));

    const field = path.slice('items[].'.length);
    const items = Array.isArray(data.items) ? data.items : [];
    return items.length === 0 || items.some((item) => isMissing(item?.[field]));
  });

/**
 * Validación mínima de una factura antes de imprimir.
 * - errors: impiden imprimir.
 * - warnings: se muestran, pero se puede imprimir.
 *
 * @param {InvoiceData} data
 * @returns {{ errors: string[], warnings: string[] }}
 */
export const validateInvoiceData = (data) => {
  const errors = [];
  const warnings = [];

  if (!isValidInvoiceType(data.invoiceType)) {
    errors.push('No se pudo determinar si la factura es de crédito o de contado.');
  }
  if (isMissing(data.facturaNo)) {
    errors.push('La factura no trae número (facturaNo); no se podría auditar la impresión.');
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    warnings.push('La factura no trae renglones (items).');
  }
  // Avisos detectados al traducir el JSON de la API (moneda, totales que no cuadran…).
  if (Array.isArray(data.notices)) warnings.push(...data.notices);
  return { errors, warnings };
};
