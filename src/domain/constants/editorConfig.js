/**
 * @file Parámetros de configuración del editor y de la hoja.
 *
 * Capa: DOMINIO. Reglas de negocio "puras" (límites, opciones válidas) que
 * consumen tanto el store como los componentes de presentación.
 */

import { DEFAULT_FONT_FAMILY } from './paperDimensions';

/** Límites y paso del zoom del lienzo (1 = 100%). */
export const ZOOM_LIMITS = {
  MIN: 0.5,
  MAX: 1.8,
  STEP: 0.1,
  DEFAULT: 1,
};

/** Rango permitido para los márgenes físicos de la hoja, en milímetros. */
export const MARGIN_LIMITS_MM = {
  MIN: 0,
  MAX: 120,
};

/**
 * Tipografías disponibles para la hoja. `value` es la pila CSS que se guarda
 * en `pageSetup.fontFamily`.
 */
export const FONT_OPTIONS = [
  { value: DEFAULT_FONT_FAMILY, label: 'Courier New (Fiel a Matriz / Fiscal)' },
  { value: 'ui-monospace, monospace', label: 'Monospace Moderno' },
  { value: 'system-ui, sans-serif', label: 'Sans-serif' },
];

/**
 * Resuelve el valor del `<select>` de tipografía. Las plantillas antiguas
 * guardaban solo `'Courier New'`, que no coincide con ninguna opción; en ese
 * caso se busca la opción que empiece por ese nombre o se usa la primera.
 *
 * @param {string} fontFamily Valor guardado en la plantilla.
 * @returns {string} Valor de una opción existente en FONT_OPTIONS.
 */
export const resolveFontOption = (fontFamily = '') => {
  const exact = FONT_OPTIONS.find((option) => option.value === fontFamily);
  if (exact) return exact.value;

  const partial = FONT_OPTIONS.find((option) => fontFamily && option.value.includes(fontFamily));
  return (partial ?? FONT_OPTIONS[0]).value;
};
