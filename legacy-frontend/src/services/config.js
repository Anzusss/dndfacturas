/**
 * @file Origen de datos de la aplicación.
 *
 * Capa: SERVICIOS.
 *
 *   VITE_BACKEND_URL=http://localhost:3000/api   → todo va al backend NestJS (PostgreSQL).
 *   (vacío)                                      → modo local: localStorage del navegador.
 *
 * Se configura en `.env.local` (ver `.env.example`) y requiere reiniciar `npm run dev`.
 */

/** URL base del backend, sin barra final. Vacía = modo local. */
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

/** `true` si los datos se guardan en el backend. */
export const USE_BACKEND = Boolean(BACKEND_URL);
