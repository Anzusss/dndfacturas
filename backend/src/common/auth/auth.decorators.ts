/**
 * @file Decoradores de autorización.
 *
 *   @RequirePermission(PERMISSIONS.REVIEW_TEMPLATES)  → en un endpoint
 *   metodo(@CurrentUser() user: AuthUser)             → en un parámetro
 */

import { SetMetadata, createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Permission } from '../../domain/permissions.js';
import type { AuthUser, AuthenticatedRequest } from './auth.types.js';

/** Clave de metadatos donde se guarda el permiso requerido. */
export const REQUIRED_PERMISSION_KEY = 'requiredPermission';

/**
 * Marca un endpoint como protegido por un permiso. Sin este decorador el
 * endpoint es de lectura libre.
 */
export const RequirePermission = (permission: Permission) => SetMetadata(REQUIRED_PERMISSION_KEY, permission);

/** Inyecta el usuario identificado por `MockAuthGuard`. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);
