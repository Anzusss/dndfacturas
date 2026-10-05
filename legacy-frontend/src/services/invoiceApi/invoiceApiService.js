/**
 * @file Cliente de la API de facturas de la empresa (datos de Dynamics).
 *
 * Capa: SERVICIOS.
 *
 * Tres modos (archivo `.env.local`, ver `.env.example`):
 *
 *   1. BACKEND: si VITE_BACKEND_URL está definida, la factura se pide al backend,
 *      que hace de proxy hacia Dynamics (recomendado: el token queda en el servidor).
 *   2. API directa: VITE_INVOICE_API_URL (solo para pruebas; sin claves secretas).
 *   3. Simulado: si no hay ninguna de las dos.
 *
 * Configuración de la API directa:
 *   VITE_INVOICE_API_URL=https://servidor/api/facturas/{numero}
 *     - `{numero}` se sustituye por el número de factura.
 *     - Si no hay `{numero}`, se añade al final: .../facturas/SERIE%20H%200000255
 *     - Si la variable está vacía, se usa el MODO SIMULADO (mockInvoices.js).
 *
 * A diferencia del servicio anterior, si la API falla NO se usan datos
 * simulados en silencio: al probar la API real hay que ver el error real.
 *
 * ⚠ SEGURIDAD: las variables VITE_* acaban dentro del JavaScript que descarga
 * el navegador. No pongas claves secretas aquí; si la API exige una clave,
 * la llamada debe pasar por un backend.
 */

import { USE_BACKEND } from '../config';
import { backendInvoiceService } from '../backend/backendServices';
import { MOCK_INVOICES } from './mockInvoices';

const API_URL_TEMPLATE = import.meta.env.VITE_INVOICE_API_URL || '';

/** 'backend' | 'api' | 'mock' (ver modos arriba). */
export const INVOICE_API_MODE = USE_BACKEND ? 'backend' : API_URL_TEMPLATE ? 'api' : 'mock';

/** Números de factura disponibles en modo simulado (para mostrarlos como ayuda). */
export const MOCK_INVOICE_NUMBERS = Object.keys(MOCK_INVOICES);

/** Latencia simulada para que el modo mock se comporte como una red real. */
const MOCK_LATENCY_MS = 300;

/**
 * Construye la URL de una factura.
 * @param {string} invoiceNumber
 */
const buildUrl = (invoiceNumber) => {
  const encoded = encodeURIComponent(invoiceNumber);
  return API_URL_TEMPLATE.includes('{numero}')
    ? API_URL_TEMPLATE.replace('{numero}', encoded)
    : `${API_URL_TEMPLATE.replace(/\/$/, '')}/${encoded}`;
};

/**
 * Cabeceras de autenticación. PENDIENTE: cuando la plantilla de la empresa
 * aporte la sesión, devolver aquí su token (p. ej. `Authorization: Bearer …`).
 * @returns {Record<string, string>}
 */
const getAuthHeaders = () => ({});

export const invoiceApiService = {
  /**
   * Obtiene el JSON "crudo" de una factura, tal cual lo devuelve la API.
   * @param {string} invoiceNumber
   * @param {{email:string, role:string}} [user] Usuario de la sesión (lo exige el backend).
   * @returns {Promise<Object>}
   * @throws {Error} Con un mensaje legible (no encontrada, sin conexión, etc.).
   */
  async getRawInvoice(invoiceNumber, user) {
    if (INVOICE_API_MODE === 'backend') return backendInvoiceService.getRawInvoice(invoiceNumber, user);

    const number = invoiceNumber.trim();
    if (!number) throw new Error('Introduce un número de factura.');

    if (INVOICE_API_MODE === 'mock') {
      await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
      const invoice = MOCK_INVOICES[number];
      if (!invoice) throw new Error(`Factura "${number}" no encontrada (modo simulado).`);
      return structuredClone(invoice);
    }

    let response;
    try {
      response = await fetch(buildUrl(number), {
        headers: { Accept: 'application/json', ...getAuthHeaders() },
      });
    } catch (error) {
      // fetch solo falla aquí por red, CORS o URL inválida.
      throw new Error(`No se pudo conectar con la API de facturas (${error.message}). Revisa la URL y CORS.`);
    }

    if (response.status === 404) throw new Error(`Factura "${number}" no encontrada.`);
    if (!response.ok) throw new Error(`La API respondió ${response.status} ${response.statusText}.`);

    try {
      return await response.json();
    } catch {
      throw new Error('La API no devolvió un JSON válido.');
    }
  },
};
