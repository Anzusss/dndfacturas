/**
 * @file Casos de uso del flujo de plantillas (guardar, enviar, aprobar, activar, importar…).
 *
 * Capa: SERVICIOS. Elige la implementación según la configuración:
 * - Backend NestJS (PostgreSQL) si VITE_BACKEND_URL está definida.
 * - localStorage del navegador en caso contrario (ver services/local/).
 * Ambas tienen la misma interfaz, así el resto de la app no cambia.
 */

import { USE_BACKEND } from './config';
import { templateWorkflowService as localTemplateWorkflowService } from './local/templateWorkflowService';
import { backendTemplateWorkflowService } from './backend/backendServices';

export const templateWorkflowService = USE_BACKEND ? backendTemplateWorkflowService : localTemplateWorkflowService;
