/**
 * @file Persistencia de plantillas (todas sus versiones).
 *
 * Capa: SERVICIOS. Elige la implementación según la configuración:
 * - Backend NestJS (PostgreSQL) si VITE_BACKEND_URL está definida.
 * - localStorage del navegador en caso contrario (ver services/local/).
 * Ambas tienen la misma interfaz, así el resto de la app no cambia.
 */

import { USE_BACKEND } from './config';
import { templateService as localTemplateService } from './local/templateService';
import { backendTemplateService } from './backend/backendServices';

export const templateService = USE_BACKEND ? backendTemplateService : localTemplateService;
