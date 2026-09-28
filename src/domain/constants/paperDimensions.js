/**
 * @file Constantes físicas del papel y de la conversión mm ↔ px.
 *
 * Capa: DOMINIO. La hoja del editor se dibuja en píxeles CSS (96 DPI), pero
 * la factura se imprime en papel; aquí se centraliza la conversión.
 * Los tamaños de hoja disponibles están en `paperSizes.js`.
 */

/** DPI estándar de CSS: 1in = 96px. */
export const DPI_SCREEN = 96;

/** Milímetros que hay en una pulgada. */
export const MM_TO_INCH = 25.4;

/** Pila tipográfica por defecto (monoespaciada, fiel a las matrices fiscales). */
export const DEFAULT_FONT_FAMILY = "'Courier New', Courier, monospace";

/**
 * Convierte milímetros a píxeles CSS (96 DPI), redondeando.
 * @param {number} mm
 * @returns {number}
 */
export const mmToScreenPx = (mm) => Math.round((mm / MM_TO_INCH) * DPI_SCREEN);

/**
 * Valores por defecto de la plantilla Carta: tamaño y márgenes para papel
 * membretado, según la especificación del roadmap.
 */
export const PAPER_DIMENSIONS = {
  SIZE: 'LETTER',
  WIDTH_MM: 216,
  HEIGHT_MM: 279,
  MARGIN_TOP_MM: 50,    // Reserva para el membrete pre-impreso.
  MARGIN_BOTTOM_MM: 40, // Reserva para firmas / colectas.
  MARGIN_LEFT_MM: 15,
  MARGIN_RIGHT_MM: 15,
  FONT_FAMILY_DEFAULT: DEFAULT_FONT_FAMILY,
};
