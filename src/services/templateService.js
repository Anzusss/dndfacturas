import { createDefaultInvoiceTemplate } from '../domain/models/invoiceTemplate';

const STORAGE_KEY = 'dndfacturas_templates_v3_real';

/**
 * Servicio para gestión y persistencia de plantillas de factura.
 */
export const templateService = {
  async getTemplates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.templateId === 'factura-fiscal-real-v1') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error al leer plantillas de localStorage:', e);
    }
    const defaultTemplate = createDefaultInvoiceTemplate();
    const initialList = [defaultTemplate];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
    return initialList;
  },

  async getTemplateById(id) {
    const templates = await this.getTemplates();
    return templates.find((t) => t.templateId === id) || templates[0];
  },

  async saveTemplate(template) {
    const templates = await this.getTemplates();
    const existingIndex = templates.findIndex((t) => t.templateId === template.templateId);
    let updated;
    if (existingIndex >= 0) {
      updated = [...templates];
      updated[existingIndex] = template;
    } else {
      updated = [...templates, template];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return template;
  },
};
