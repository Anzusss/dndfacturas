/**
 * @file Historial de cambios de plantillas.
 *
 * Capa: SERVICIOS. Elige la implementación según la configuración:
 * - Backend NestJS (PostgreSQL) si VITE_BACKEND_URL está definida.
 * - localStorage del navegador en caso contrario (ver services/local/).
 * Ambas tienen la misma interfaz, así el resto de la app no cambia.
 */

import { USE_BACKEND } from './config';
import { templateHistoryService as localTemplateHistoryService } from './local/templateHistoryService';
import { backendTemplateHistoryService } from './backend/backendServices';

export const templateHistoryService = USE_BACKEND ? backendTemplateHistoryService : localTemplateHistoryService;
