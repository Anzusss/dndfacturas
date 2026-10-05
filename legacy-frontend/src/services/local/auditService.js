/**
 * @file Registro y consulta de impresiones (implementación LOCAL, localStorage).
 *
 * Capa: SERVICIOS. Mock temporal sobre localStorage, preparado para migrar a
 * `POST /invoices/:id/print` y `GET /invoices/audit` en NestJS.
 *
 * Cada impresión guarda la plantilla Y SU VERSIÓN, para poder saber con qué
 * diseño exacto se imprimió cada factura aunque la plantilla cambie después.
 */

import { PRINT_STATUS } from '@/domain/models/printLog';
import { localStorageClient } from '../storage/localStorageClient';

const AUDIT_STORAGE_KEY = 'dndfacturas_print_logs';

/** Registros de demostración que se cargan la primera vez. */
const createMockLogs = () => [
  {
    id: 'log-001',
    invoiceId: 'FAC-0004820',
    invoiceType: 'CREDITO',
    templateId: 'factura-fiscal-real-v1',
    templateVersion: 1,
    printedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    user: 'operador.fiscal@empresa.com',
    copies: 1,
    status: PRINT_STATUS.SUCCESS,
  },
  {
    id: 'log-002',
    invoiceId: 'FAC-0004821',
    invoiceType: 'CONTADO',
    templateId: 'factura-contado-v1',
    templateVersion: 1,
    printedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    user: 'administracion@empresa.com',
    copies: 2,
    status: PRINT_STATUS.SUCCESS,
  },
];

export const auditService = {
  /**
   * Historial de impresiones (más reciente primero). Si no existe, lo
   * inicializa con datos de demostración.
   * @returns {Promise<Object[]>}
   */
  async getPrintLogs() {
    const stored = localStorageClient.read(AUDIT_STORAGE_KEY);
    if (Array.isArray(stored)) return stored;

    const mockLogs = createMockLogs();
    localStorageClient.write(AUDIT_STORAGE_KEY, mockLogs);
    return mockLogs;
  },

  /**
   * Cuántas veces se ha impreso ya una factura (solo impresiones reales).
   * @param {string} invoiceId
   * @returns {Promise<number>}
   */
  async countPrints(invoiceId) {
    const logs = await this.getPrintLogs();
    return logs.filter((log) => log.invoiceId === invoiceId && log.status === PRINT_STATUS.SUCCESS).length;
  },

  /**
   * Registra un evento de impresión al inicio del historial.
   *
   * @param {Object}  params
   * @param {string}  params.invoiceId       Número de factura.
   * @param {string}  [params.invoiceType]   CREDITO | CONTADO.
   * @param {string}  params.templateId      Plantilla utilizada.
   * @param {number}  [params.templateVersion] Versión de la plantilla.
   * @param {{email:string, role:string}} [params.user] Usuario que imprime.
   * @param {number}  [params.copies]
   * @param {string}  [params.status]        Uno de PRINT_STATUS.
   * @returns {Promise<Object>} El registro creado.
   */
  async recordPrintEvent({
    invoiceId,
    invoiceType = null,
    templateId,
    templateVersion = null,
    user,
    copies = 1,
    status = PRINT_STATUS.SUCCESS,
  }) {
    const logs = await this.getPrintLogs();
    const newLog = {
      id: `log-${Date.now()}`,
      invoiceId,
      invoiceType,
      templateId,
      templateVersion,
      printedAt: new Date().toISOString(),
      user: user?.email ?? 'usuario_actual',
      copies,
      status,
    };
    localStorageClient.write(AUDIT_STORAGE_KEY, [newLog, ...logs]);
    return newLog;
  },
};
