/**
 * @file Cliente HTTP del backend NestJS.
 *
 * Capa: SERVICIOS / INFRAESTRUCTURA. Centraliza la URL base, las cabeceras de
 * usuario y la conversión de errores HTTP a mensajes legibles.
 *
 * Autenticación SIMULADA: el usuario viaja en `X-User-Email` / `X-User-Role`.
 * Cuando exista el inicio de sesión de la empresa, bastará con cambiar
 * `buildUserHeaders` para enviar su token.
 */

import { BACKEND_URL } from '../config';

/**
 * Cabeceras que identifican al usuario ante el backend.
 * @param {{email:string, role:string}} [user]
 */
const buildUserHeaders = (user) => (user ? { 'X-User-Email': user.email, 'X-User-Role': user.role } : {});

/**
 * Extrae el mensaje de error de una respuesta del backend.
 * Nest devuelve `{ message: string | string[] }`.
 */
const readErrorMessage = async (response) => {
  try {
    const body = await response.json();
    return Array.isArray(body.message) ? body.message.join(' ') : body.message;
  } catch {
    return null;
  }
};

/**
 * Hace una petición al backend.
 *
 * @param {string} path  Ruta relativa, p. ej. "/templates".
 * @param {Object} [options]
 * @param {string} [options.method='GET']
 * @param {any}    [options.body]   Se envía como JSON.
 * @param {{email:string, role:string}} [options.user] Usuario de la sesión.
 * @returns {Promise<any>} Cuerpo JSON de la respuesta (o `null` si viene vacío).
 * @throws {Error} Con el mensaje del backend y `status` con el código HTTP.
 */
export const apiRequest = async (path, { method = 'GET', body, user } = {}) => {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...buildUserHeaders(user),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`No se pudo conectar con el backend (${BACKEND_URL}). ¿Está en marcha?`);
  }

  if (!response.ok) {
    const error = new Error((await readErrorMessage(response)) || `El backend respondió ${response.status}.`);
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/** Codifica un segmento de URL (ids y números de factura con espacios, etc.). */
export const segment = (value) => encodeURIComponent(String(value));
