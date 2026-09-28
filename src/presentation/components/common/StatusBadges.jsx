/**
 * @file Insignias reutilizables: estado de plantilla y tipo de factura.
 */

import { TEMPLATE_STATUS, TEMPLATE_STATUS_LABELS } from '@/domain/models/templateLifecycle';
import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';

/** Estilo de cada estado. */
const STATUS_CLASS = {
  [TEMPLATE_STATUS.DRAFT]: 'badge-neutral',
  [TEMPLATE_STATUS.IN_REVIEW]: 'badge-warning',
  [TEMPLATE_STATUS.APPROVED]: 'badge-success',
};

/** @param {{status:string}} props */
export const TemplateStatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_CLASS[status] ?? 'badge-neutral'}`}>{TEMPLATE_STATUS_LABELS[status] ?? status}</span>
);

/** @param {{invoiceType:string}} props */
export const InvoiceTypeBadge = ({ invoiceType }) => (
  <span className="badge badge-primary">{INVOICE_TYPE_LABELS[invoiceType] ?? invoiceType ?? '—'}</span>
);
