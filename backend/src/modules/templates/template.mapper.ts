/**
 * @file Convierte la entidad de base de datos al formato de plantilla que
 * usa el frontend (InvoiceTemplate), para que el cliente no tenga que
 * adaptar nada.
 */

import type { InvoiceTemplateEntity } from './invoice-template.entity.js';
import type { JsonObject } from '../../common/types/json.types.js';

/** Plantilla tal como la entiende el frontend. */
export interface TemplateResponse {
  $schema: 'InvoiceTemplate';
  schemaVersion: number;
  templateId: string;
  version: number;
  name: string;
  invoiceType: string;
  status: string;
  reviewComment: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  approvedBy: string | null;
  approvedAt: Date | null;
  pageSetup: JsonObject;
  elements: JsonObject[];
}

/** Entidad → respuesta. */
export const toTemplateResponse = (entity: InvoiceTemplateEntity): TemplateResponse => ({
  $schema: 'InvoiceTemplate',
  schemaVersion: entity.schemaVersion,
  templateId: entity.templateId,
  version: entity.version,
  name: entity.name,
  invoiceType: entity.invoiceType,
  status: entity.status,
  reviewComment: entity.reviewComment,
  createdBy: entity.createdBy,
  createdAt: entity.createdAt,
  updatedBy: entity.updatedBy,
  updatedAt: entity.updatedAt,
  approvedBy: entity.approvedBy,
  approvedAt: entity.approvedAt,
  pageSetup: entity.pageSetup,
  elements: entity.elements,
});
