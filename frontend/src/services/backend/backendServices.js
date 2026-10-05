/**
 * @file Implementaciones de los servicios de datos contra el backend NestJS.
 *
 * Capa: SERVICIOS. Cada objeto tiene EXACTAMENTE la misma interfaz que su
 * equivalente de `services/local/`, así la interfaz de usuario no cambia al
 * pasar de localStorage al backend.
 *
 * Las reglas del flujo (permisos, transiciones, historial) las aplica el
 * backend; aquí solo se traducen las llamadas a HTTP.
 */

import { normalizeTemplate } from '@/domain/models/invoiceTemplate';
import { createNextVersion } from '@/domain/models/templateLifecycle';
import { apiRequest, segment } from './httpClient';

/** Ruta de una versión concreta. */
const versionPath = ({ templateId, version }) => `/templates/${segment(templateId)}/versions/${segment(version)}`;

/** Normaliza una o varias plantillas recibidas del backend. */
const normalizeAll = (templates) => templates.map(normalizeTemplate);

// ───────────── Plantillas (lectura) ─────────────

export const backendTemplateService = {
  async getAll() {
    return normalizeAll(await apiRequest('/templates'));
  },

  async getLatest() {
    return normalizeAll(await apiRequest('/templates?latest=true'));
  },

  async getTemplate(templateId, version) {
    try {
      return normalizeTemplate(await apiRequest(versionPath({ templateId, version })));
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  },

  async getNextVersionNumber(templateId) {
    const { nextVersion } = await apiRequest(`/templates/${segment(templateId)}/next-version`);
    return nextVersion;
  },
};

// ───────────── Plantilla activa por tipo ─────────────

export const backendActiveTemplateService = {
  /** { CREDITO: { templateId, version, … } | null, … } */
  getActiveMap() {
    return apiRequest('/active-templates');
  },

  /** Plantilla completa del tipo, o `null` si no hay ninguna activa. */
  async getActiveTemplate(invoiceType) {
    try {
      return normalizeTemplate(await apiRequest(`/active-templates/${segment(invoiceType)}/template`));
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  },
};

// ───────────── Historial de plantillas ─────────────

export const backendTemplateHistoryService = {
  getHistory() {
    return apiRequest('/template-history?limit=1000');
  },
};

// ───────────── Auditoría de impresiones ─────────────

export const backendAuditService = {
  getPrintLogs() {
    return apiRequest('/print-logs?limit=1000');
  },

  async countPrints(invoiceId) {
    const { count } = await apiRequest(`/print-logs/count?invoiceId=${segment(invoiceId)}`);
    return count;
  },

  /** El usuario se envía en cabeceras: el backend no acepta registrar a nombre de otro. */
  recordPrintEvent({ invoiceId, invoiceType, templateId, templateVersion, user, copies, status }) {
    return apiRequest('/print-logs', {
      method: 'POST',
      user,
      body: {
        invoiceId,
        invoiceType: invoiceType ?? undefined,
        templateId,
        templateVersion: templateVersion ?? undefined,
        copies,
        status,
      },
    });
  },
};

// ───────────── Flujo de plantillas (casos de uso) ─────────────

export const backendTemplateWorkflowService = {
  /** Guarda un borrador (el backend registra si es nueva, nueva versión o edición). */
  async saveDraft(template, user) {
    const saved = await apiRequest(versionPath(template), {
      method: 'PUT',
      user,
      body: {
        name: template.name,
        invoiceType: template.invoiceType,
        pageSetup: template.pageSetup,
        elements: template.elements,
        schemaVersion: template.schemaVersion,
      },
    });
    return normalizeTemplate(saved);
  },

  async submitForReview(template, user) {
    return normalizeTemplate(await apiRequest(`${versionPath(template)}/submit`, { method: 'POST', user }));
  },

  async approve(template, user) {
    return normalizeTemplate(await apiRequest(`${versionPath(template)}/approve`, { method: 'POST', user }));
  },

  async reject(template, user, comment) {
    return normalizeTemplate(
      await apiRequest(`${versionPath(template)}/reject`, { method: 'POST', user, body: { comment } }),
    );
  },

  async activate(template, user) {
    await apiRequest(`/active-templates/${segment(template.invoiceType)}`, {
      method: 'PUT',
      user,
      body: { templateId: template.templateId, version: template.version },
    });
    return template;
  },

  /** Prepara (sin guardar) la siguiente versión en borrador. */
  async prepareNextVersion(template, user) {
    const nextVersion = await backendTemplateService.getNextVersionNumber(template.templateId);
    return createNextVersion(template, nextVersion, user.email);
  },

  exportTemplate(template, user) {
    return apiRequest(`${versionPath(template)}/export`, { method: 'POST', user });
  },

  /** @param {string} fileText Contenido del archivo elegido. */
  async importTemplate(fileText, user) {
    let payload;
    try {
      payload = JSON.parse(fileText);
    } catch {
      throw new Error('El archivo no es un JSON válido.');
    }
    return normalizeTemplate(await apiRequest('/templates/import', { method: 'POST', user, body: payload }));
  },
};

// ───────────── Facturas (proxy a Dynamics a través del backend) ─────────────

export const backendInvoiceService = {
  /** JSON de la factura tal como lo devuelve Dynamics. */
  getRawInvoice(invoiceNumber, user) {
    const number = invoiceNumber.trim();
    if (!number) return Promise.reject(new Error('Introduce un número de factura.'));
    return apiRequest(`/invoices/${segment(number)}`, { user });
  },
};
