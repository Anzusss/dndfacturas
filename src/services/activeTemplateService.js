/**
 * @file Plantilla activa por tipo de factura.
 *
 * Capa: SERVICIOS. Elige la implementación según la configuración:
 * - Backend NestJS (PostgreSQL) si VITE_BACKEND_URL está definida.
 * - localStorage del navegador en caso contrario (ver services/local/).
 * Ambas tienen la misma interfaz, así el resto de la app no cambia.
 */

import { USE_BACKEND } from './config';
import { activeTemplateService as localActiveTemplateService } from './local/activeTemplateService';
import { backendActiveTemplateService } from './backend/backendServices';

export const activeTemplateService = USE_BACKEND ? backendActiveTemplateService : localActiveTemplateService;
