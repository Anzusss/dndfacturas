import { MM_TO_INCH, DPI_SCREEN } from '../domain/constants/paperDimensions';

/**
 * Convierte milímetros a píxeles basados en el DPI de pantalla.
 * @param {number} mm 
 * @returns {number} px
 */
export const mmToPx = (mm) => {
  return Math.round((mm / MM_TO_INCH) * DPI_SCREEN);
};

/**
 * Convierte píxeles a milímetros.
 * @param {number} px 
 * @returns {number} mm
 */
export const pxToMm = (px) => {
  return Math.round(((px * MM_TO_INCH) / DPI_SCREEN) * 10) / 10;
};

/**
 * Formatea moneda para visualización bimonetaria
 * @param {number} amount 
 * @param {'USD'|'VES'} currency 
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return '0.00';
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + (currency === 'USD' ? ' $' : ' Bs.');
};
