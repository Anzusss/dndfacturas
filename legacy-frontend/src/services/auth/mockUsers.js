/**
 * @file Usuarios simulados, uno por rol.
 *
 * Capa: SERVICIOS (mock). SUSTITUIR por el usuario con sesión que aporte la
 * plantilla de la empresa cuando se integre el inicio de sesión.
 */

import { ROLES } from '@/domain/models/permissions';

/** Usuario simulado de cada rol (referencias estables, útiles para selectores de Zustand). */
export const MOCK_USERS = {
  [ROLES.DESIGNER]: { role: ROLES.DESIGNER, name: 'Diseñador', email: 'disenador@empresa.com' },
  [ROLES.MANAGER]: { role: ROLES.MANAGER, name: 'Gerente de Tesorería', email: 'gerente.tesoreria@empresa.com' },
};
