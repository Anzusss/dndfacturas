/**
 * @file Conversión de unidades (mm ↔ px). El formato de importes está en `formatters.js`.
 *
 * Capa: UTILIDADES. Funciones puras sin estado ni dependencias de React.
 */

import { MM_TO_INCH, DPI_SCREEN, mmToScreenPx } from '@/domain/constants/paperDimensions';

/**
 * Convierte milímetros a píxeles CSS (96 DPI). La fórmula vive en el dominio
 * porque también la necesita el cálculo de tamaños de hoja.
 * @param {number} mm
 * @returns {number} px redondeados.
 */
export const mmToPx = mmToScreenPx;

/**
 * Convierte píxeles CSS a milímetros (1 decimal).
 * @param {number} px
 * @returns {number} mm
 */
export const pxToMm = (px) => Math.round(((px * MM_TO_INCH) / DPI_SCREEN) * 10) / 10;

/**
 * Extrae el número de un valor con unidad tipo "50mm".
 * Antes esta función estaba duplicada en MarginGuidelines y PageSetupPanel.
 *
 * @param {string|number} value    Valor a interpretar ("50mm", "12.5", 30…).
 * @param {number}        fallback Valor a devolver si no es numérico.
 * @returns {number}
 */
export const parseMm = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
