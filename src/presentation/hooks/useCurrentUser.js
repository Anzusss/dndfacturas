/**
 * @file Hooks de sesión: usuario actual y permisos.
 * Hoy leen la sesión simulada; al integrar el login de la empresa solo
 * cambiará `useSessionStore`, no los componentes que usan estos hooks.
 */

import { useSessionStore, selectCurrentUser } from '@/store/useSessionStore';
import { hasPermission } from '@/domain/models/permissions';

/** @returns {{role:string, name:string, email:string}} */
export const useCurrentUser = () => useSessionStore(selectCurrentUser);

/**
 * @param {string} permission Uno de PERMISSIONS.
 * @returns {boolean} `true` si el usuario actual tiene el permiso.
 */
export const usePermission = (permission) => useSessionStore((state) => hasPermission(state.role, permission));
