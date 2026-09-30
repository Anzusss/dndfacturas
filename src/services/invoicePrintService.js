/**
 * @file Caso de uso "imprimir una factura real".
 *
 * Capa: SERVICIOS (aplicación).
 *
 *   JSON de la API ──▶ traducción ──▶ validación ──▶ plantilla activa de su tipo
 *                                                   ──▶ campos que faltan ──▶ (imprimir) ──▶ auditoría
 */

import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';
import { findMissingBindings, validateInvoiceData } from '@/domain/models/invoiceData';
import { PERMISSIONS, hasPermission } from '@/domain/models/permissions';
import { PRINT_STATUS } from '@/domain/models/printLog';
import { mapDynamicsInvoice } from './invoiceApi/dynamicsInvoiceMapper';
import { invoiceApiService } from './invoiceApi/invoiceApiService';
import { activeTemplateService } from './activeTemplateService';
import { auditService } from './auditService';

/**
 * @typedef {Object} PreparedInvoice
 * @property {Object}      raw            JSON original de la API (para depurar).
 * @property {Object}      invoice        Datos traducidos (InvoiceData).
 * @property {Object|null} template       Plantilla activa a usar.
 * @property {string[]}    errors         Impiden imprimir.
 * @property {string[]}    warnings       Avisos; se puede imprimir.
 * @property {string[]}    missingFields  Campos de la plantilla que la factura no trae.
 * @property {number}      previousPrints Veces que ya se imprimió esta factura.
 */

/**
 * Quita de los "campos que faltan" los que es normal que falten: en una
 * factura en bolívares no hay importes en US$ (ya lo explica un aviso aparte).
 * @param {string[]} missing
 * @param {Object} invoice
 */
const filterExpectedGaps = (missing, invoice) =>
  invoice.moneda === 'VES' ? missing.filter((path) => !path.endsWith('Usd')) : missing;

export const invoicePrintService = {
  /**
   * Descarga el JSON de una factura (backend, API directa o mock).
   * @param {string} invoiceNumber
   * @param {{email:string, role:string}} user
   */
  fetchRawInvoice(invoiceNumber, user) {
    return invoiceApiService.getRawInvoice(invoiceNumber, user);
  },

  /**
   * Prepara una factura para imprimir a partir del JSON de la API.
   * @param {Object} raw
   * @returns {Promise<PreparedInvoice>}
   */
  async prepare(raw) {
    const invoice = mapDynamicsInvoice(raw);
    const { errors, warnings } = validateInvoiceData(invoice);

    const template = invoice.invoiceType ? await activeTemplateService.getActiveTemplate(invoice.invoiceType) : null;
    if (invoice.invoiceType && !template) {
      errors.push(`No hay plantilla activa para facturas de ${INVOICE_TYPE_LABELS[invoice.invoiceType]}.`);
    }

    return {
      raw,
      invoice,
      template,
      errors,
      warnings,
      missingFields: template ? filterExpectedGaps(findMissingBindings(template, invoice), invoice) : [],
      previousPrints: invoice.facturaNo ? await auditService.countPrints(invoice.facturaNo) : 0,
    };
  },

  /**
   * Registra en auditoría una impresión ya lanzada.
   * @param {PreparedInvoice} prepared
   * @param {{email:string, role:string}} user
   */
  async recordPrint(prepared, user) {
    if (!hasPermission(user.role, PERMISSIONS.PRINT_INVOICES)) {
      throw new Error('No tienes permiso para imprimir facturas.');
    }
    return auditService.recordPrintEvent({
      invoiceId: prepared.invoice.facturaNo,
      invoiceType: prepared.invoice.invoiceType,
      templateId: prepared.template.templateId,
      templateVersion: prepared.template.version,
      user,
      status: PRINT_STATUS.SUCCESS,
    });
  },
};
