/**
 * @file Guard global de autenticación SIMULADA y autorización por permisos.
 *
 * Mientras no exista el inicio de sesión de la empresa, el usuario llega en
 * las cabeceras `X-User-Email` y `X-User-Role` (las envía el frontend con el
 * "Rol (simulado)").
 *
 * ⚠ SUSTITUIR antes de producción: cualquiera puede enviar esas cabeceras.
 * Cuando la plantilla de la empresa aporte un token (JWT, sesión, SSO…),
 * solo hay que cambiar `resolveUser` para validarlo; los endpoints y el
 * decorador @RequirePermission seguirán igual.
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission, isRole, type Permission } from '../../domain/permissions.js';
import { REQUIRED_PERMISSION_KEY } from './auth.decorators.js';
import { AUTH_HEADERS, type AuthUser, type AuthenticatedRequest } from './auth.types.js';

/** Formato mínimo de un correo, para rechazar cabeceras claramente inválidas. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+$/;

@Injectable()
export class MockAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = this.resolveUser(request);

    const required = this.reflector.getAllAndOverride<Permission | undefined>(REQUIRED_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true; // Endpoint de lectura libre.

    if (!request.user) {
      throw new UnauthorizedException('Falta identificar al usuario (cabeceras X-User-Email y X-User-Role).');
    }
    if (!hasPermission(request.user.role, required)) {
      throw new ForbiddenException('No tienes permiso para realizar esta acción.');
    }
    return true;
  }

  /** Lee el usuario de las cabeceras simuladas. Devuelve `undefined` si faltan o son inválidas. */
  private resolveUser(request: AuthenticatedRequest): AuthUser | undefined {
    const email = request.header(AUTH_HEADERS.EMAIL)?.trim();
    const role = request.header(AUTH_HEADERS.ROLE)?.trim().toUpperCase();
    if (!email || !EMAIL_REGEX.test(email) || !isRole(role)) return undefined;
    return { email, role };
  }
}
