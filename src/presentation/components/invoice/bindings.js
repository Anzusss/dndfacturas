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
 * @param {Object}  data   InvoiceData.
 * @param {string}  path   Ruta del campo.
 * @param {Object}  [options]
 * @param {string}  [options.format] Formato forzado; si no, el del catálogo.
 * @param {boolean} [options.showPlaceholder=true] Si el dato falta, mostrar `{{campo}}`
 *   (útil en el editor). Al imprimir se pasa `false` para dejar el hueco en blanco:
 *   un marcador `{{telefono}}` nunca debe salir en el papel fiscal.
 * @returns {string}
 */
export const displayField = (data, path, { format = getFieldFormat(path), showPlaceholder = true } = {}) => {
  const value = getValueByPath(data, path);
  if (value === undefined || value === null || value === '') return showPlaceholder ? `{{${path}}}` : '';
  return formatBoundValue(value, format);
};

/**
 * Sustituye las `{{variables}}` de un texto con los datos de la factura.
 * @param {string}  text
 * @param {Object}  data
 * @param {boolean} [showPlaceholder=true] Igual que en `displayField`.
 */
export const renderText = (text, data, showPlaceholder = true) =>
  interpolateText(
    text,
    data,
    (value, path) => formatBoundValue(value, getFieldFormat(path)),
    showPlaceholder ? undefined : () => '',
  );
