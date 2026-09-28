/**
 * @file Utilidades de los bloques para mostrar datos de la factura.
 *
 * Une el dominio (leer valores por ruta) con las utilidades (formato de
 * importes). Si un dato no llegó, se muestra el marcador `{{ruta}}` para que
 * se note en la vista previa en lugar de imprimir un hueco silencioso.
 */

import { getValueByPath, interpolateText } from '@/domain/models/invoiceData';
import {
  DYNAMICS_VARIABLES_BY_KEY,
  TOTAL_FIELDS_BY_KEY,
} from '@/domain/constants/dynamicsVariables';
import { formatBoundValue } from '@/utils/formatters';

/** Formato por defecto de un campo según el catálogo (cabecera o totales). */
const getFieldFormat = (path) => DYNAMICS_VARIABLES_BY_KEY[path]?.format ?? TOTAL_FIELDS_BY_KEY[path]?.format;

/**
 * Texto a mostrar para un campo de la factura.
 * @param {Object} data   InvoiceData.
 * @param {string} path   Ruta del campo.
 * @param {string} [format] Formato forzado; si no, el del catálogo.
 * @returns {string}
 */
export const displayField = (data, path, format = getFieldFormat(path)) => {
  const value = getValueByPath(data, path);
  return value === undefined || value === null || value === '' ? `{{${path}}}` : formatBoundValue(value, format);
};

/**
 * Sustituye las `{{variables}}` de un texto con los datos de la factura.
 * @param {string} text
 * @param {Object} data
 */
export const renderText = (text, data) =>
  interpolateText(text, data, (value, path) => formatBoundValue(value, getFieldFormat(path)));
