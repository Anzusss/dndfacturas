/**
 * @file Tipos de autenticación.
 */

import type { Request } from 'express';
import type { Role } from '../../domain/permissions.js';

/** Usuario que hace la petición. */
export interface AuthUser {
  email: string;
  role: Role;
}

/** Petición HTTP con el usuario ya identificado por el guard. */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/** Cabeceras que envía el frontend mientras la autenticación sea simulada. */
export const AUTH_HEADERS = {
  EMAIL: 'x-user-email',
  ROLE: 'x-user-role',
} as const;
