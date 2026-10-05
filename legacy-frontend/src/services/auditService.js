/**
 * @file Registro y consulta de impresiones de facturas.
 *
 * Capa: SERVICIOS. Elige la implementación según la configuración:
 * - Backend NestJS (PostgreSQL) si VITE_BACKEND_URL está definida.
 * - localStorage del navegador en caso contrario (ver services/local/).
 * Ambas tienen la misma interfaz, así el resto de la app no cambia.
 */

import { USE_BACKEND } from './config';
import { auditService as localAuditService } from './local/auditService';
import { backendAuditService } from './backend/backendServices';

export const auditService = USE_BACKEND ? backendAuditService : localAuditService;
