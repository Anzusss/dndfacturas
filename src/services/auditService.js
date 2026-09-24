const AUDIT_STORAGE_KEY = 'dndfacturas_print_logs';

/**
 * Servicio para registro y auditoría de eventos de impresión.
 */
export const auditService = {
  async getPrintLogs() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error al leer auditoría de impresión:', e);
    }

    // Datos iniciales de demostración
    const mockLogs = [
      {
        id: 'log-001',
        invoiceId: 'FAC-0004820',
        templateId: 'factura-fiscal-v1',
        printedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        user: 'operador.fiscal@empresa.com',
        copies: 1,
        status: 'SUCCESS',
      },
      {
        id: 'log-002',
        invoiceId: 'FAC-0004821',
        templateId: 'factura-fiscal-v1',
        printedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        user: 'administracion@empresa.com',
        copies: 2,
        status: 'SUCCESS',
      },
    ];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockLogs));
    return mockLogs;
  },

  async recordPrintEvent({ invoiceId, templateId, user = 'usuario_actual' }) {
    const logs = await this.getPrintLogs();
    const newLog = {
      id: `log-${Date.now()}`,
      invoiceId,
      templateId,
      printedAt: new Date().toISOString(),
      user,
      copies: 1,
      status: 'SUCCESS',
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  },
};
