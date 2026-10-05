/**
 * @file Sesión del usuario (SIMULADA).
 *
 * Capa: ESTADO. Guarda solo el rol elegido en el selector "Rol (simulado)".
 * Se persiste en localStorage para no perderlo al recargar.
 *
 * SUSTITUIR cuando la plantilla de la empresa aporte el usuario real: basta
 * con que `selectCurrentUser` devuelva ese usuario ({ email, name, role }).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES } from '@/domain/models/permissions';
import { MOCK_USERS } from '@/services/auth/mockUsers';

export const useSessionStore = create(
  persist(
    (set) => ({
      role: ROLES.DESIGNER,
      setRole: (role) => set({ role }),
    }),
    { name: 'dndfacturas_mock_session' },
  ),
);

/**
 * Usuario actual. Devuelve siempre la misma referencia para un rol dado,
 * requisito para que Zustand no re-renderice en bucle.
 * @returns {{role:string, name:string, email:string}}
 */
export const selectCurrentUser = (state) => MOCK_USERS[state.role] ?? MOCK_USERS[ROLES.DESIGNER];
