/**
 * @file Hooks de sesión: usuario actual y permisos.
 * Adaptan la sesión de la plantilla empresarial a los permisos internos de
 * facturación. La aplicación usa solo dos perfiles generales y no expone un
 * selector de roles.
 */

import { useAuth } from '@gruposerex/auth-module';
import { ROLES } from '@/domain/models/permissions';
import { hasPermission } from '@/domain/models/permissions';

const MOCK_ROLE = ROLES.MANAGER;

/** Convierte los nombres habituales de Identity a los perfiles de facturación. */
export const mapIdentityRole = () => MOCK_ROLE;

/** @returns {{role:string|null, name:string, email:string, isLoading:boolean, authUser:Object|null}} */
export const useCurrentUser = () => {
	const { user, isLoading } = useAuth();
	const role = mapIdentityRole(user);

	return {
		role,
		name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || '',
		email: user?.email || '',
		isLoading,
		authUser: user,
	};
};

/**
 * @param {string} permission Uno de PERMISSIONS.
 * @returns {boolean} `true` si el usuario actual tiene el permiso.
 */
export const usePermission = (permission) => {
	const { user, isLoading } = useAuth();
	return !isLoading && hasPermission(mapIdentityRole(user), permission);
};
